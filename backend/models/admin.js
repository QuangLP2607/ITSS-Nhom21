import client from '../config/db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import 'dotenv/config';

export default class Admin {
    constructor(id, role) {
        this.id = id;
        this.role = role;
        this.adminSetup().catch(error => {
            console.error('Error in adminSetup constructor:', error);})
    }

    // async setup() {
    //     try {
    //         const query = `SELECT exists (SELECT 1 FROM pg_roles WHERE rolname = '${this.id}');`;
    //         const { rows } = await client.query(query);
    //         if (rows[0].exists) {
    //             return;   
    //         } else {
    //             await this.createRole();
    //         }          
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    async adminSetup() {
        try {
            // await this.setup();
            const query = `
                GRANT ALL PRIVILEGES ON DATABASE itss TO $1;
                SET SESSION AUTHORIZATION $2;
            `;
            await client.query(query, [this.id, this.id]);
        } catch (error) {
            throw error;
        }
    }

    static async getUserIdAndRole(req, res, next) {
        try {
            const role = req.baseUrl.split('/')[1];
            const query = `SELECT userid FROM public.admin WHERE email = $1;`;
            const { rows } = await client.query(query, [req.body.email]);
            return { id: rows[0].userid, role: role };
        } catch (error) {
            throw error;
        }
    }

    static async comparePassword(req, res, next) {
        try {
            const query = `SELECT password FROM public.${req.baseUrl.split('/')[1]} WHERE email = $1;`;
            const result = await client.query(query, [req.body.email]);
            if (result.rows.length === 0) {
                return false; // Email not found
            }
            const hashedPassword = result.rows[0].password;
            return bcrypt.compare(req.body.password, hashedPassword);
        } catch (error) {
            throw error;
        }
    }

    static async getJsonWebToken(req, res, next) {
        try {
            const query = `SELECT email FROM public.${req.baseUrl.split('/')[1]} WHERE email = $1;`;
            const { rows } = await client.query(query, [req.body.email]);
            if (rows.length === 0) {
                return res.status(404).json({ error: 'Email not found' });
            }
            const email = rows[0].email;
            const token = jwt.sign({ email: email }, process.env.JWT_SECRET);
            res.cookie('token', token, {
                httpOnly: true,
                expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            });
            res.status(200).send({ token: token });
        } catch (error) {
            throw error;
        }
    }
}
