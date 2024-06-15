import client from '../config/db.js';
import Admin from '../models/admin.js'
export default class AdminControllers {
    static async loginAmin(req, res, next) {
        try {
            const isPasswordCorrect = await Admin.comparePassword(req, res, next);
            if (!isPasswordCorrect) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }
            await Admin.getJsonWebToken(req, res, next); 
            const { id, role } = await Admin.getUserIdAndRole(req, res, next);
            // if (role === 'admin')
            new Admin(id, role);
                   
            res.status(200).json({
                success: true,
                message: 'login successfully',
                userid: id,
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async logoutAmin(req, res, next) {
        try {
            res.clearCookie('token');
            res.status(200).json({ message: 'logged out successfully' });
            // Return postgres client to pool
            await client.query('SET ROLE postgres;');
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    
}
