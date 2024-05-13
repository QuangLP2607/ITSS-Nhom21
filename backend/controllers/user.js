import User from '../models/user.js'
import client from '../config/db.js'

export default class UserControllers {

    static async loginUser(req, res, next) {
        try {
            const isPasswordCorrect = await User.comparePassword(req, res, next);
            if (!isPasswordCorrect) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }
            await User.getJsonWebToken(req, res, next); 
            const { id, role } = await User.getUserIdAndRole(req, res, next);
            if (role === 'admin') {
                // new Admin(userId, role);
            } else if (role === 'user') {
                new User(id, role);
            }          
            res.status(200).json({
                success: true,
                message: 'Login successfully',
                userid: id,
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

    //==================getItemsList================================
    static async getItemsList(req, res, next) {
        try {
            res.status(200).json({
                items: await User.getItemsList(req, res, next),
                message: 'itemsList fetched successfully',
            });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }
    
    //==================getGroupID================================
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

    static async getShoppingItems(req, res, next) {
        try {
            res.status(200).json({
                shoppingItems: await User.getShoppingItems(req, res, next),
                message: 'shoppingItems fetched successfully',
            });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }

    static async addShoppingItems(req, res, next) {
        try {
            await User.addShoppingItems(req, res, next)
            res.status(200).json({  
                message: 'addShoppingItems successfully'
            });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }

    static async getRecipes(req, res, next) {
        try {
            res.status(200).json({
                recipes: await User.getRecipes(req, res, next),
                message: 'recipes fetched successfully',
            });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }

    static async getFavoriteRecipes(req, res, next) {
        try {
            res.status(200).json({
                favoriteRecipes: await User.getFavoriteRecipes(req, res, next),
                message: 'favoriteRecipes fetched successfully',
            });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }

    
}