import client from '../config/db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import 'dotenv/config';

export default class Group {
    
    static async getGroupID(req, res, next) {
        try {
            const query = 'SELECT groupid, groupname FROM group_user JOIN groups using (groupid) WHERE userid = $1';
            const userid = [req.query.userid];
            const result = await client.query(query, userid);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }
}