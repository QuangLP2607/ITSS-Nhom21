import client from '../config/db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import 'dotenv/config';

export default class ShoppingItems {
    
    static async getShoppingItems(req, res, next) {
        try {
            const query = `SELECT * FROM shoppingitems 
            JOIN items USING (itemid) WHERE groupid = $1 AND dateadded = $2`;
            const groupid = req.query.groupid;
            const dateadded = req.query.dateadded;
            const result = await client.query(query, [groupid, dateadded]); 
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async addShoppingItem(req, res, next) {
        try {
            const { quantity, dateadded, status, note, itemid, groupid } = req.body;
            let query = `INSERT INTO public.shoppingitems(
                            quantity, dateadded, status, note, itemid, groupid)
                            VALUES ($1,$2,$3,$4,$5,$6)
                            RETURNING shoppingitemid;`; 
            const result = await client.query(query, [quantity, dateadded, status, note, itemid, groupid]);
            const newShoppingItemId = result.rows[0].shoppingitemid;
            return newShoppingItemId; 
        } catch (error) {
            throw error;
        } 
    }
    
    static async deleteShoppingItem(req, res, next) {
        try {
            const shoppingitemid = req.query.shoppingitemid;
            const query = `DELETE FROM public.shoppingitems WHERE shoppingitemid = ${shoppingitemid}`;
            await client.query(query);
        } catch (error) {
            throw error;
        }
    }

    static async updateShoppingItem(req, res, next) {
        try {
            const { quantity, status, note } = req.body;
            const shoppingitemid = req.query.shoppingitemid;
            const query = `UPDATE public.shoppingitems
                           SET quantity = $1, status = $2, note = $3
                           WHERE shoppingitemid = $4`;
            await client.query(query, [quantity, status, note, shoppingitemid]);
        } catch (error) {
            throw error;
        }
    }
    
}