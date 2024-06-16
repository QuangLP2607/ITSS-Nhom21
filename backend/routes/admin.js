import express from 'express'
import AdminControllers from '../controllers/admin.js'
import {isAuthUser} from '../middleware/auth.js'
const router = express.Router()

    router.route('/login')
        .post(AdminControllers.loginAdmin)
    router.route('/logout')
        .get(AdminControllers.logoutAdmin)
    router.route('/items')
        .get(AdminControllers.getAllItems)
        .post(AdminControllers.createItems)
        .patch(AdminControllers.updateItems)
        .delete(AdminControllers.deleteItems)
    router.route('/recipes')
        .get(AdminControllers.getAllRecipes)
        .post(AdminControllers.createRecipes)
        .patch(AdminControllers.updateRecipes)
        .delete(AdminControllers.deleteRecipes)

    router.route('/group')
        .get(AdminControllers.getAllGroup)
        // .post(AdminControllers.createRecipes)
        // .patch(AdminControllers.updateRecipes)
        // .delete(AdminControllers.deleteRecipes)
    
export default router;