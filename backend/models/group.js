import client from '../config/db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import 'dotenv/config';

export default class Group {
    
    static async getGroupID(req, res, next) {
        try {
            res.status(200).json({
                groupID: await User.getGroupID(req, res, next),
                message: 'groupID fetched successfully',
            });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }
}