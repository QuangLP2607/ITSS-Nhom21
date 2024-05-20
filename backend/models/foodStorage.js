import client from '../config/db.js';
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

    static async addFoodStorage(req, res, next) {
        try {
            const { quantity, dateadded, status, note, itemid, groupid } = req.body;
            let query = `INSERT INTO public.fridgeitems(
                         expirydate, quantity, itemid, groupid)
                         VALUES ( $1, $2, $3, $4);`; 
            const result = await client.query(query, [current_date, quantity, itemid, groupid]);
            const newShoppingItemId = result.rows[0].shoppingitemid;
            return newShoppingItemId; 
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

    static async getExpiryAlerts(req, res, next) {
        try {
            const {userid, groupid} = req.query;
            const query =  `SELECT alertid, itemname, alertdate FROM expiryalerts 
                            JOIN items ON expiryalerts.fridgeitemid = items.itemid 
                            WHERE userid = $1 AND groupid = $2 AND status=$3`;
            const result = await client.query(query, [userid, groupid, 'pending']);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }
}