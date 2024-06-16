import express from 'express'
import UserControllers from '../controllers/user.js'
import {isAuthUser} from '../middleware/auth.js'
const router = express.Router()

    router.route('/login')
        .post(UserControllers.loginUser)
    router.route('/logout')
        .get(UserControllers.logoutUser)
    router.route('/signup')
        .post(UserControllers.signUpUser);
    
    router.route('/listUser')
        .get(isAuthUser,UserControllers.getListUser)


    router.route('/group')
        .get(isAuthUser,UserControllers.getGroupID)
        .post(isAuthUser,UserControllers.createGroup)

    router.route('/groupmember')
        .get(isAuthUser,UserControllers.getGroupMember)
        .post(isAuthUser,UserControllers.addGroupMember)
        .delete(isAuthUser,UserControllers.deleteGroupMember)

    router.route('/groupinvitation')
        .get(isAuthUser,UserControllers.getInvitations)
        .post(isAuthUser,UserControllers.sendInvitation)
        .patch(isAuthUser,UserControllers.repyInvitation)

    router.route('/itemslist')
        .get(isAuthUser,UserControllers.getItemsList)

    router.route('/shoppingitems')
        .get(isAuthUser,UserControllers.getShoppingItems)
        .post(isAuthUser,UserControllers.addShoppingItem)
        .delete(isAuthUser,UserControllers.deleteShoppingItem)
        .patch(isAuthUser,UserControllers.updateShoppingItem)

    router.route('/mealplan')
        .get(isAuthUser,UserControllers.getMealPlan)
        .post(isAuthUser,UserControllers.addMealPlan)
        .delete(isAuthUser,UserControllers.deleteRecipeMeal)  
        .patch(isAuthUser,UserControllers.updateRecipeMeal)

    router.route('/recipes')
        .get(isAuthUser,UserControllers.getRecipes)
    

    router.route('/favoriterecipes')
        .get(isAuthUser,UserControllers.getFavoriteRecipes)
        .post(isAuthUser,UserControllers.addFavoriteRecipe)
        .delete(isAuthUser,UserControllers.deleteFavoriteRecipe)

    router.route('/foodStorage')
        .get(isAuthUser,UserControllers.getFoodStorage)
        .delete(isAuthUser,UserControllers.deleteFoodStorage)  
        .patch(isAuthUser,UserControllers.updateFoodStorage)
  
    router.route('/expiryAlert')
        .get(isAuthUser,UserControllers.getExpiryAlerts)

export default router;