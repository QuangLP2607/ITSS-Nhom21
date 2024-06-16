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

    static async getAllItems(req, res, next) {
        try {
            const result = await client.query('SELECT * FROM items');
            res.status(200).json(result.rows);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async createItems(req, res, next) {
        const { itemname, timeexpired } = req.body;
        try {
            const query = 'INSERT INTO items (itemname, timeexpired) VALUES ($1, $2) RETURNING *';
            const values = [itemname, timeexpired];
            const result = await client.query(query, values);
            res.status(201).json(result.rows[0]);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async updateItems(req, res, next) {
        const { id } = req.query; // Change to req.query.id
        const { itemname, timeexpired } = req.body;
        try {
            const query = 'UPDATE items SET itemname = $1, timeexpired = $2 WHERE itemid = $3 RETURNING *';
            const values = [itemname, timeexpired, id];
            const result = await client.query(query, values);
            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Item not found' });
            }
            res.status(200).json(result.rows[0]);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async deleteItems(req, res, next) {
        const { id } = req.query;
        try {
            const result = await client.query('DELETE FROM items WHERE itemid = $1 RETURNING *', [id]);
            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Item not found' });
            }
            res.status(200).json({ message: 'Item deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getAllRecipes(req, res, next)  {
        try {
            const result = await client.query('SELECT * FROM recipes');
            res.status(200).json(result.rows);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    static async createRecipes(req, res, next) {
        const { recipename, instructions } = req.body;
        try {
            const query = 'INSERT INTO recipes (recipename, instructions) VALUES ($1, $2) RETURNING *';
            const values = [recipename, instructions];
            const result = await client.query(query, values);
            res.status(201).json(result.rows[0]);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    static async updateRecipes(req, res, next) {
        const { recipeid } = req.query; // Change to req.query.recipeid
        const { recipename, instructions } = req.body;
        try {
            const query = 'UPDATE recipes SET recipename = $1, instructions = $2 WHERE recipeid = $3 RETURNING *';
            const values = [recipename, instructions, recipeid];
            const result = await client.query(query, values);
            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Recipe not found' });
            }
            res.status(200).json(result.rows[0]);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    static async deleteRecipes(req, res, next) {
        const { recipeid } = req.query; // Change to req.query.recipeid
        try {
            const result = await client.query('DELETE FROM recipes WHERE recipeid = $1 RETURNING *', [recipeid]);
            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Recipe not found' });
            }
            res.status(200).json({ message: 'Recipe deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    



}
