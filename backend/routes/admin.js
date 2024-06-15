import express from 'express'
import AdminControllers from '../controllers/admin.js'
import {isAuthUser} from '../middleware/auth.js'
const router = express.Router()

    router.route('/login')
        .post(AdminControllers.loginAmin)
    router.route('/logout')
        .get(AdminControllers.logoutAmin)
export default router;