import User from '../models/user.js';
import Items from '../models/items.js';
import MealPlan from '../models/mealPlan.js';
import Group from '../models/group.js';
import ShoppingItems from '../models/shoppingItems.js';
import Recipes from '../models/recipes.js';
import FoodStorage from '../models/foodStorage.js';
import client from '../config/db.js';

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

    //==================Items================================
    static async getItemsList(req, res, next) {
        try {
            res.status(200).json({
                items: await Items.getItemsList(req, res, next),
                message: 'itemsList fetched successfully',
            });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }
    
    //==================Group================================
    static async getGroupID(req, res, next) {
        try {
            res.status(200).json({
                groupID: await Group.getGroupID(req, res, next),
                message: 'groupID fetched successfully',
            });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }

    //==================ShoppingItems================================
    static async getShoppingItems(req, res, next) {
        try {
            res.status(200).json({
                shoppingItems: await ShoppingItems.getShoppingItems(req, res, next),
                message: 'shoppingItems fetched successfully',
            });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }

    static async addShoppingItem(req, res, next) {
        try {
            const newShoppingItemId = await ShoppingItems.addShoppingItem(req, res, next);
            res.status(200).json({  
                message: 'addShoppingItem successfully',
                newShoppingItemId: newShoppingItemId 
            });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }
    
    static async deleteShoppingItem(req, res, next) {
        try {
            await ShoppingItems.deleteShoppingItem(req, res, next);
            res.status(200).json({ message: 'ShoppingItem deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }
    
    static async updateShoppingItem(req, res, next) {
        try {
            await ShoppingItems.updateShoppingItem(req, res, next);
            res.status(200).json({ message: 'ShoppingItem updated successfully' });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }

    //==================MealPlan================================
    static async getMealPlan(req, res, next) {
        try {
            res.status(200).json({
                recipes: await MealPlan.getMealPlan(req, res, next),
                message: 'MealPlan fetched successfully',
            });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }

    static async addMealPlan(req, res, next) {
        try {
            await MealPlan.addMealPlan(req, res, next);
            res.status(200).json({  
                message: 'addMealPlan successfully'
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    
    static async deleteRecipeMeal(req, res, next) {
        try {
            await MealPlan.deleteRecipeMeal(req, res, next);
            res.status(200).json({ message: 'Recipe meal deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }
    
    static async updateRecipeMeal(req, res, next) {
        try {
            await MealPlan.updateRecipeMeal(req, res, next);
            res.status(200).json({ message: 'Recipe meal updated successfully' });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }
    //==================Recipes================================
    static async getRecipes(req, res, next) {
        try {
            const recipes = await Recipes.getRecipes(req);
            res.status(200).json({
                recipes: recipes,
                message: 'Recipes fetched successfully',
            });
        } catch (error) {
            next(error); 
        }
    }

    static async getFavoriteRecipes(req, res, next) {
        try {
            res.status(200).json({
                favoriteRecipes: await Recipes.getFavoriteRecipes(req, res, next),
                message: 'favoriteRecipes fetched successfully',
            });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }

    //==============FoodStorage=====================
    static async getFoodStorage(req, res, next) {
        try {
            res.status(200).json({
                FoodStorage: await FoodStorage.getFoodStorage(req, res, next),
                message: 'FoodStorage fetched successfully',
            });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }

    static async deleteFoodStorage(req, res, next) {
        try {
            res.status(200).json({
                FoodStorage: await FoodStorage. deleteFoodStorage(req, res, next),
                message: 'Delete food successfully',
            });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }

    static async updateFoodStorage(req, res, next) {
        try {
            res.status(200).json({
                FoodStorage: await FoodStorage.updateFoodStorage(req, res, next),
                message: 'Update food successfully',
            });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }
    
}