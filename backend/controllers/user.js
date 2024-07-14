import User from '../models/user.js';
import ListUser from '../models/listUser.js';
import Group from '../models/group.js';
import GroupInvitation from '../models/groupInvitation.js';
import Items from '../models/items.js';
import MealPlan from '../models/mealPlan.js';
import GroupMember from '../models/groupMember.js';
import ShoppingItems from '../models/shoppingItems.js';
import Recipes from '../models/recipes.js';
import FavoriteRecipe from '../models/favoriteRecipes.js';
import FoodStorage from '../models/foodStorage.js';
import client from '../config/db.js';

export default class UserControllers {

    //==================User================================
    static async loginUser(req, res, next) {
        try {
            const isPasswordCorrect = await User.comparePassword(req, res, next);
            if (!isPasswordCorrect) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }
            await User.getJsonWebToken(req, res, next); 
            const { id, role } = await User.getUserIdAndRole(req, res, next);
            // if (role === 'admin') {
            //     new Admin(id, role);
            // } else if (role === 'user') {
            //     new User(id, role);
            // }
            res.status(200).json({
                success: true,
                message: 'login successfully',
                userid: id
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async logoutUser(req, res, next) {
        try {
            res.clearCookie('token');
            res.status(200).json({ message: 'logged out successfully' });
            // Return postgres client to pool
            await client.query('SET ROLE postgres;');
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async signUpUser(req, res, next) {
        try {
            await User.signUpUser(req, res, next );
            await UserControllers.loginUser(req, res, next); 
        } catch (error) {
            next(error); 
        }
    }

    //==================List User================================
    static async getListUser(req, res, next) {
        try {
            res.status(200).json({
                listUser: await ListUser.getListUser(req, res, next),
                message: 'list user fetched successfully'
            });
        } catch (error) {
            res.status(500).json({ error: error });
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

    static async createGroup(req, res, next) {
        try {
            const newGroupId = await Group.createGroup(req, res, next);
            res.status(200).json({  
                message: 'group create successfully',
                newGroupId: newGroupId 
            });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }

    //==================Group member================================
    static async getGroupMember(req, res, next) {
        try {
            res.status(200).json({
                groupMember: await GroupMember.getGroupMember(req, res, next),
                message: 'group member fetched successfully',
            });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }

    static async addGroupMember(req, res, next) {
        try {
            await GroupMember.addGroupMember(req, res, next);
            res.status(200).json({  
                message: 'group member added successfully'
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    
    static async deleteGroupMember(req, res, next) {
        try {
            await GroupMember.deleteGroupMember(req, res, next);
            res.status(200).json({ message: 'group member deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }

    //==================Group Invitation=============================
    static async  getInvitations(req, res, next) {
        try {
            res.status(200).json({
                groupInvitation: await GroupInvitation.getInvitations(req, res, next),
                message: 'group invatation fetched successfully',
            });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }

    static async sendInvitation(req, res, next) {
        try {
            await GroupInvitation.sendInvitation(req, res, next);
            res.status(200).json({  
                message: 'send invitation successfully'
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async repyInvitation(req, res, next) {
        try {
            await GroupInvitation.repyInvitation(req, res, next);
            res.status(200).json({  
                message: 'repy invitation successfully'
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
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


    
    static async deleteShoppingItem(req, res, next) {
        try {
            await ShoppingItems.deleteShoppingItem(req, res, next);
            res.status(200).json({ message: 'shoppingItem deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }
    
    static async updateShoppingItem(req, res, next) {
        try {
            await ShoppingItems.updateShoppingItem(req, res, next);
            res.status(200).json({ message: 'shoppingItem updated successfully' });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }

    //==================MealPlan================================
    static async getMealPlan(req, res, next) {
        try {
            res.status(200).json({
                recipes: await MealPlan.getMealPlan(req, res, next),
                message: 'mealPlan fetched successfully',
            });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }

    static async addMealPlan(req, res, next) {
        try {
            await MealPlan.addMealPlan(req, res, next);
            res.status(200).json({  
                message: 'mealPlan add successfully'
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    
    static async deleteRecipeMeal(req, res, next) {
        try {
            await MealPlan.deleteRecipeMeal(req, res, next);
            res.status(200).json({ message: 'recipe meal deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }
    
    static async updateRecipeMeal(req, res, next) {
        try {
            await MealPlan.updateRecipeMeal(req, res, next);
            res.status(200).json({ message: 'recipe meal updated successfully' });
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
                message: 'recipes fetched successfully',
            });
        } catch (error) {
            next(error); 
        }
    }

    //==================FavoriteRecipe================================
    static async getFavoriteRecipes(req, res, next) {
        try {
            res.status(200).json({
                favoriteRecipes: await FavoriteRecipe.getFavoriteRecipes(req, res, next),
                message: 'favoriteRecipes fetched successfully',
            });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }

    static async addFavoriteRecipe(req, res, next) {
        try {
            await FavoriteRecipe.addFavoriteRecipe(req, res, next);
            res.status(200).json({
                message: 'add favorite recipe successfully'
            });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }

    static async deleteFavoriteRecipe(req, res, next) {
        try {
            await FavoriteRecipe.deleteFavoriteRecipe(req, res, next);
            res.status(200).json({ message: 'favorite recipe deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }

    //==============FoodStorage=====================
    static async getFoodStorage(req, res, next) {
        try {
            res.status(200).json({
                FoodStorage: await FoodStorage.getFoodStorage(req, res, next),
                message: 'foodStorage fetched successfully',
            });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }

    static async addFoodStorage(req, res, next) {
        try {
            await FoodStorage.addFoodStorage(req, res, next);
            res.status(200).json({  
                message: 'foodStorage add successfully'
            });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }

    static async addShoppingItem(req, res, next) {
        try {
            const newShoppingItemId = await ShoppingItems.addShoppingItem(req, res, next);
            res.status(200).json({  
                message: 'shoppingItem add successfully',
                newShoppingItemId: newShoppingItemId 
            });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }

    static async deleteFoodStorage(req, res, next) {
        try {
            res.status(200).json({
                FoodStorage: await FoodStorage. deleteFoodStorage(req, res, next),
                message: 'delete food successfully',
            });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }

    static async updateFoodStorage(req, res, next) {
        try {
            res.status(200).json({
                FoodStorage: await FoodStorage.updateFoodStorage(req, res, next),
                message: 'update food successfully',
            });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }

    //==============Expiry Alert===================== 
    static async getExpiryAlerts(req, res, next) {
        try {
            res.status(200).json({
                Arlerts: await FoodStorage.getExpiryAlerts(req, res, next),
                message: 'expiry alerts fetched successfully',
            });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }

    static async updateExpiryAlerts(req, res, next) {
        try {
            res.status(200).json({
                Arlerts: await FoodStorage.updateExpiryAlerts(req, res, next),
                message: 'expiry alerts updated successfully',
            });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }
    
}