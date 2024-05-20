import express from 'express';
import UserControllers from '../controllers/user.js';
import {isAuthUser} from '../middleware/auth.js';
const router = express.Router();

    router.route('/login')
    .post(UserControllers.loginUser);
    router.route('/logout')
    .get(UserControllers.logoutUser);
    router.route('/signup')
    .post(UserControllers.createUser);

    router.route('/group')
    .get(isAuthUser,UserControllers.getGroupID);

    router.route('/itemslist')
    .get(isAuthUser,UserControllers.getItemsList);

    router.route('/shoppingitems')
    .get(isAuthUser,UserControllers.getShoppingItems)
    .post(isAuthUser,UserControllers.addShoppingItem)
    .delete(isAuthUser,UserControllers.deleteShoppingItem)
    .patch(isAuthUser,UserControllers.updateShoppingItem);

    router.route('/mealplan')
    .get(isAuthUser,UserControllers.getMealPlan)
    .post(isAuthUser,UserControllers.addMealPlan)
    .delete(isAuthUser,UserControllers.deleteRecipeMeal)  
    .patch(isAuthUser,UserControllers.updateRecipeMeal);

    router.route('/recipes')
    .get(isAuthUser,UserControllers.getRecipes);
    

    router.route('/favoriterecipes')
    .post(isAuthUser,UserControllers.getFavoriteRecipes);
    //thêm ctna vào dsut
    router.route('/foodStorage')
    .get(isAuthUser,UserControllers.getFoodStorage)
    .delete(isAuthUser,UserControllers.deleteFoodStorage)  
    .patch(isAuthUser,UserControllers.updateFoodStorage);
  
    router.route('/cookingplans')

export default router;