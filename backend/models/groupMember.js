import client from '../config/db.js';
import 'dotenv/config';

export default class GroupMember {

    static async getGroupMember(req, res, next) {
        try {
            const groupid = [req.query.groupid];
            const query = 'SELECT userid, username, email FROM group_user JOIN users USING (userid) WHERE groupid= $1';
            const result = await client.query(query, groupid);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async addGroupMember(req, res, next) {
        try {
            const {userid, groupid} = req.body;
            const query =  `INSERT INTO public.group_user(
                            userid, groupid, isowner)
                            VALUES ($1, $2, false)`;
            await client.query(query, [userid, groupid]);
        } catch (error) {
            throw error;
        }
    }

    static async deleteGroupMember(req, res, next) {
        try {
            const {userid, groupid} = req.query;
            const query =  `DELETE FROM public.group_user
                            WHERE userid= ${userid} AND groupid= ${groupid}`;
            await client.query(query);
        } catch (error) {
            throw error;
        }
    }
}