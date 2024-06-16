import client from '../config/db.js';
import 'dotenv/config';

export default class Items {

    static async getItemsList(req, res, next) {
        try {
            const query = 'SELECT itemid, itemname FROM items';
            const result = await client.query(query);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    
}