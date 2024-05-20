import client from '../config/db.js';
import 'dotenv/config';

export default class Recipes {

    static async getRecipes(req) {
        try {
            let query =`SELECT recipeid, recipename, instructions, json_agg(json_build_object('itemid', itemid, 'itemname', itemname)) AS item_ids
                        FROM recipe_item
                        JOIN recipes USING (recipeid)
                        JOIN items USING (itemid)
                        GROUP BY recipeid, recipename, instructions`;
            let result;
            if (req.query.recipeid) {
                query += ' WHERE recipeid = $1';
                result = await client.query(query, [req.query.recipeid]);
            } else {
                result = await client.query(query);     
            }
            if (result.rows.length === 0) return [];
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

}