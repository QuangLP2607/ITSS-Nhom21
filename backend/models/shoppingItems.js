import client from '../config/db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import 'dotenv/config';

export default class ShoppingItems {
    static async getShoppingItems(req, res, next) {
        try {
            const query = `SELECT itemname, quantity, note, status, dateadded FROM shoppingitems 
            JOIN items USING (itemid) WHERE groupid = $1 AND dateadded = $2`;
            const groupid = req.query.groupid;
            const dateadded = req.query.dateadded;
            const result = await client.query(query, [groupid, dateadded]); 
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async addShoppingItems(req, res, next) {
        try {
            const { quantity, dateadded, status, note, itemid, groupid } = req.body;
            let query =`INSERT INTO public.shoppingitems(
                        quantity, dateadded, status, note, itemid, groupid)
                        VALUES ($1,$2,$3,$4,$5,$6);`;
            await client.query(query, [quantity, dateadded, status, note, itemid, groupid]);
        } catch (error) {
            throw error;
        }
    }

    static async deleteShoppingItems(req, res, next) {
        try {
            let query =`INSERT INTO public.shoppingitems(
                        quantity, dateadded, status, note, itemid, groupid)
                        VALUES ($1,$2,$3,$4,$5,$6);`;
            await client.query(query, [quantity, dateadded, status, note, itemid, groupid]);
        } catch (error) {
            throw error;
        }
    }

}