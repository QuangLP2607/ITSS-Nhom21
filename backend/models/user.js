import client from '../config/db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import 'dotenv/config';

export default class User {
    constructor(id, role) {
        this.id = id;
        this.role = role;
        this.setup();
    }
    // Private method to create a new user in database with special role
    async setup() {
        try {
            const query = `
            DROP OWNED BY "${this.id}";
            DROP USER IF EXISTS "${this.id}";
            CREATE USER "${this.id}" WITH PASSWORD '${this.role}';
            GRANT USAGE ON SCHEMA public TO "${this.id}";
            GRANT SELECT ON ALL TABLES IN SCHEMA public TO "${this.id}";

            GRANT USAGE ON SCHEMA search TO "${this.id}";
            GRANT SELECT ON ALL TABLES IN SCHEMA search TO "${this.id}";
            GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA search TO "${this.id}"`;
            await client.query(query);            
        } catch (error) {
            throw error;
        }
    }

    static async getUserIdAndRole(req, res, next) {
        try {
            const role = req.baseUrl.split('/')[1];
            let query = `SELECT userid FROM public.users WHERE email = $1;`;
            const { rows } = await client.query(query, [req.body.email]);
            return {
                id: rows[0].userid, role: role
            }
        } catch (error) {
            throw error;
        }
    }

    static async comparePassword(req, res, next) {
        try {
            // -----------------------------------
            let query = `SELECT password FROM public.${req.baseUrl.split('/')[1]} WHERE email = '${req.body.email}';`;
            const result = await client.query(query);
            return bcrypt.compare(req.body.password, result.rows[0].password);
            // -----------------------------------
        } catch (error) {
            throw error;
        }
    }

    static async getJsonWebToken(req, res, next) {
        try {
            let query = `SELECT email FROM public.${req.baseUrl.split('/')[1]} WHERE email = $1;`;
            const { rows } = await client.query(query, [req.body.email]);
            if (rows.length === 0) {
                return res.status(404).json({ error: 'Email not found' });
            }
            const email = rows[0].email;
            let token = jwt.sign({ email: email }, process.env.JWT_SECRET);
            res.status(200).cookie('token', token, {
                httpOnly: true,
                expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            });
        } catch (error) {
            throw error;
        }
    }

    //==================getItemsList================================
    static async getItemsList(req, res, next) {
        try {
            const query = 'SELECT itemid, itemname FROM items';
            const result = await client.query(query);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    //==================getGroupID================================
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

    //==================getShoppingItems================================
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

    //==================getRecipes================================
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

    //==================getFavoriteRecipes================================
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
}