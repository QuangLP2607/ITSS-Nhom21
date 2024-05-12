import User from '../../models/User/user.js';
import Admin from '../../models/User/admin.js';
import Student from '../../models/User/student.js';
import Lecturer from '../../models/User/lecturer.js';
import client from '../../config/db.js';

export default class UserControllers {
    static async loginUser(req, res, next) {
        try {
            const isPasswordCorrect = await User.comparePassword(req, res, next);
            if (!isPasswordCorrect) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }
            await User.getJsonWebToken(req, res, next); // Login successfully
            const { id, role } = await User.getUserIdAndRole(req, res, next);
            if (role === 'admin') {
                new Admin(id, role);
            } else if (role === 'student') {
                new Student(id, role);
            } else if (role === 'lecturer') {
                new Lecturer(id, role);
            }
            res.status(200).json({
                success: true,
                message: 'Login successfully' 
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async logoutUser(req, res, next) {
        try {
            res.clearCookie('token');
            res.status(200).json({ message: 'Logged out successfully' });
            // Return postgres client to pool
            await client.query('SET ROLE postgres;');
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}