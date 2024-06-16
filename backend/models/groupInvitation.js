import client from '../config/db.js';
import 'dotenv/config';

export default class GroupInvitation {

    static async getInvitations(req, res, next) {
        try {
            const receiverid = req.query.userid;

            const query =  `SELECT users.username, groups.groupname, g.* FROM GroupInvitations as g
                            JOIN groups USING (groupid) 
                            JOIN users ON g.senderid = users.userid
                            WHERE g.receiverid = $1 AND g.status = $2`;
            const result = await client.query(query, [receiverid, 'pending']);

            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async sendInvitation(req, res, next) {
        try {
            const { senderid, groupid, receiverid } = req.body;

            const query = 'INSERT INTO GroupInvitations (senderid, groupid, receiverid, status) VALUES ($1, $2, $3, $4) RETURNING *';
            await client.query(query, [senderid, groupid, receiverid, 'pending']); 

        } catch (error) {
            throw error;
        }
    }

    static async repyInvitation(req, res, next) {
        try {
            const invitationid = req.query.invitationid;
            const { status } = req.body;
            const updateQuery = 'UPDATE public.groupinvitations SET status = $1 WHERE invitationid = $2';
            await client.query(updateQuery, [status, invitationid]);  
        } catch (error) {
            throw error;
        }
    }

}