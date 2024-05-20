import client from '../config/db.js';
import 'dotenv/config';

export default class FavoriteRecipe {

    static async getFavoriteRecipes(req, res, next) {
        try {
            const query = 'SELECT * FROM favoriterecipes WHERE userid = $1';
            const userid = [req.query.userid];
            const result = await client.query(query, userid);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async addFavoriteRecipe(req, res, next) {
        try {
            const {userid, recipeid} = req.body;
            const query = `INSERT INTO public.favoriterecipes(userid, recipeid) VALUES ($1, $2)`;
            await client.query(query, [userid, recipeid]);
        } catch (error) {
            throw error;
        }
    }

    static async deleteFavoriteRecipe(req, res, next) {
        try {
            const {userid, recipeid} = req.query;
            const query = `DELETE FROM public.favoriterecipes WHERE userid=  ${userid} AND recipeid= ${recipeid}`;
            await client.query(query);
        } catch (error) {
            throw error;
        }
    }
}