import client from '../config/db.js';
import Admin from '../models/admin.js'
import UserControllers from './user.js';

export default class AdminController extends UserControllers {

    static async resetPassword(req, res, next) {
        try {
            res.status(200).json({
                newPassword: await Admin.resetPassword(req, res, next),
                message: 'Reset user password successfuly'
            });
        } catch (error) {
            res.status(500).json({ error: error });
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
            res.status(200).json(result.rows[0]);
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
            console.error('Error deleting item:', error); // Log error to console
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
        const { recipename, instructions, item_ids } = req.body; // item_ids is an array of existing item IDs
    
        try {
            // Start transaction
            await client.query('BEGIN');
    
            // Insert recipe and get recipeid
            const recipeQuery = 'INSERT INTO recipes (recipename, instructions) VALUES ($1, $2) RETURNING recipeid';
            const recipeValues = [recipename, instructions];
            const recipeResult = await client.query(recipeQuery, recipeValues);
            const recipeid = recipeResult.rows[0].recipeid;
    
            // Insert into recipe_item table
            for (const itemid of item_ids) {
                const recipeItemQuery = 'INSERT INTO recipe_item (recipeid, itemid) VALUES ($1, $2)';
                const recipeItemValues = [recipeid, itemid];
                await client.query(recipeItemQuery, recipeItemValues);
            }
    
            // Commit transaction
            await client.query('COMMIT');
    
            res.status(201).json({ message: 'Recipe and items linked successfully', recipeid, item_ids });
        } catch (error) {
            // Rollback transaction in case of error
            await client.query('ROLLBACK');
            res.status(500).json({ error: error.message });
        }
    }

    static async updateRecipes(req, res, next) {
        const { recipeid } = req.params; // Assuming recipeid is passed as a URL parameter
        const { recipename, instructions, item_ids } = req.body; // item_ids is an array of existing item IDs
    
        try {
            // Start transaction
            await client.query('BEGIN');
    
            // Update recipe details
            const updateRecipeQuery = 'UPDATE recipes SET recipename = $1, instructions = $2 WHERE recipeid = $3';
            const updateRecipeValues = [recipename, instructions, recipeid];
            await client.query(updateRecipeQuery, updateRecipeValues);
    
            // Delete old entries in recipe_item
            const deleteRecipeItemsQuery = 'DELETE FROM recipe_item WHERE recipeid = $1';
            await client.query(deleteRecipeItemsQuery, [recipeid]);
    
            // Insert new entries into recipe_item
            for (const itemid of item_ids) {
                const recipeItemQuery = 'INSERT INTO recipe_item (recipeid, itemid) VALUES ($1, $2)';
                const recipeItemValues = [recipeid, itemid];
                await client.query(recipeItemQuery, recipeItemValues);
            }
    
            // Commit transaction
            await client.query('COMMIT');
    
            res.status(200).json({ message: 'Recipe updated successfully', recipeid, item_ids });
        } catch (error) {
            // Rollback transaction in case of error
            await client.query('ROLLBACK');
            res.status(500).json({ error: error.message });
        }
    }

    static async deleteRecipes(req, res, next) {
        const { recipeid } = req.query;
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

    static async getAllGroup(req, res, next)  {
        try {
            const result = await client.query('SELECT * FROM groups');
            res.status(200).json(result.rows);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
    
}