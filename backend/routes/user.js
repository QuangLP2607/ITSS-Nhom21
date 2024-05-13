import express from 'express';
import UserControllers from '../controllers/user.js';
import {isAuthUser} from '../middleware/auth.js';
const router = express.Router();

    router.route('/login')
    .post(UserControllers.loginUser);
    router.route('/logout')
    .get(UserControllers.logoutUser);

    router.route('/group')
    .get(isAuthUser,UserControllers.getGroupID);

    router.route('/itemslist')
    .get(isAuthUser,UserControllers.getItemsList);

    router.route('/shoppingitems')
    .get(isAuthUser,UserControllers.getShoppingItems);

    router.route('/shoppingitems/add')
    .post(UserControllers.addShoppingItems);

    router.route('/recipes')
    .get(isAuthUser,UserControllers.getRecipes);

    router.route('/favoriterecipes')
    .post(isAuthUser,UserControllers.getFavoriteRecipes);

    router.route('/fridgeitems')

    router.route('/cookingplans')

export default router;