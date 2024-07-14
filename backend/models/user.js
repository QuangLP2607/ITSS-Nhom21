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
            let query = `SELECT userid FROM public.${role} WHERE email = $1;`;
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

    static async signUpUser(req, res, next) {
        try {
            const { username, email, password } = req.body;
            // Check if the email already exists
            let query = 'SELECT * FROM users WHERE email = $1';
            const result = await client.query(query, [email]);
            if (result.rows.length > 0) {
                throw new Error('Email already exists');
            }
            // Hash the password before saving it
            const hashedPassword = await bcrypt.hash(password, 10);
            // Insert new user into the database
            query = 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING userid';
            const values = [username, email, hashedPassword];
            const newUser = await client.query(query, values);

            return newUser.rows[0];
        } catch (error) {
            throw error;
        }
    }
}