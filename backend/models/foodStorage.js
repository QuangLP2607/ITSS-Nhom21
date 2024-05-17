import client from '../config/db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import 'dotenv/config';

export default class FoodStorage {
    
    static async getFoodStorage(req, res, next) {
        try {
            const query = 'SELECT * FROM fridgeitems JOIN items USING (itemid) WHERE groupid = $1';
            const groupid = [req.query.groupid];
            const result = await client.query(query, groupid);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async deleteFoodStorage(req, res, next) {
        try {
            const fridgeitemid = req.query.fridgeitemid;
            const query = `DELETE FROM public.fridgeitems WHERE fridgeitemid = ${fridgeitemid}`;
            await client.query(query);
        } catch (error) {
            throw error;
        }
    }

    static async updateFoodStorage(req, res, next) {
        try {
            const { quantity, expirydate } = req.body;
            const fridgeitemid = req.query.fridgeitemid;
            const query =  `UPDATE public.fridgeitems
                            SET quantity=$1, expirydate=$2
                            WHERE fridgeitemid=$3`;
            await client.query(query, [quantity, expirydate, fridgeitemid]);
        } catch (error) {
            throw error;
        }
    }
}