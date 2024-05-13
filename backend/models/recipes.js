import client from '../config/db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import 'dotenv/config';

export default class Recipes {

    static async getRecipes(req, res, next) {
        try {
            let query = `SELECT * FROM recipes`;
            if (req.query.recipename) {
                query += ' WHERE LOWER(recipename) LIKE LOWER($1)';
                const result = await client.query(query, [`%${req.query.recipename}%`]);
                return result.rows;
            } else {
                const result = await client.query(query);
                return result.rows;
            }
        } catch (error) {
            throw error;
        }
    }

    static async getFavoriteRecipes(req, res, next) {
        try {
            const userid = req.body.userid;
            let query = ` SELECT * 
            FROM favoriterecipes
            JOIN recipes USING (recipeid)
            WHERE userid = $1;`;
            
            const result = await client.query(query, [userid]);
            return result.rows;   
        } catch (error) {
            throw error;
        }
    }
}