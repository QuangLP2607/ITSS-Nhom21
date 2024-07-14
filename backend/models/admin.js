import User from './user.js';
import client from '../config/db.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

export default class Admin extends User {
    constructor(id, role) {
        super(id, role);
        this.adminSetup();
    }
    async adminSetup() {
        try {
            await this.setup();
            const query = `
            GRANT ALL PRIVILEGES ON DATABASE sms TO "${this.id}";
            SET SESSION AUTHORIZATION "${this.id}"
            `;
            await client.query(query);
        } catch (error) {
            throw error;
        }
    }

    static async resetPassword(req, res, next) {
        try {
            const userid = req.body.userid;
            const generateRandomPassword = () => {
                return crypto.randomBytes(6).toString('hex');
            };
            const newPassword = generateRandomPassword();
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            const query = `UPDATE public.users SET password = $1 WHERE userid = $2 RETURNING *;`;
            await client.query(query, [hashedPassword, userid]);
            return newPassword;
        } catch (error) {
            throw error;
        }
    }

  
}