import client from '../config/db.js';
import 'dotenv/config';

export default class ListUser {

    static async getListUser(req, res, next) {
        try {
            const query = 'SELECT userid, username, email FROM users';
            const result = await client.query(query);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }
}
