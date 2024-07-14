import express from 'express'
import AdminControllers from '../controllers/admin.js'
import {isAuthUser} from '../middleware/auth.js'
const router = express.Router()

    router.route('/login')
        .post(AdminControllers.loginUser)
    router.route('/logout')
        .get(AdminControllers.logoutUser)
    
    router.route('/resetPassword')
        .post(isAuthUser,AdminControllers.resetPassword) 
    
    router.route('/items')
        .get(isAuthUser,AdminControllers.getAllItems)
        .post(isAuthUser,AdminControllers.createItems)
        .patch(isAuthUser,AdminControllers.updateItems)
        .delete(isAuthUser,AdminControllers.deleteItems)
        
    router.route('/recipes')
        .get(isAuthUser,AdminControllers.getAllRecipes)
        .post(isAuthUser,AdminControllers.createRecipes)
        .patch(isAuthUser,AdminControllers.updateRecipes)
        .delete(isAuthUser,AdminControllers.deleteRecipes)

    router.route('/group')
        .get(isAuthUser,AdminControllers.getAllGroup)

export default router;