import ClassControllers from "../../controllers/School/class.js";
import express from "express";
import { isAuthUser } from "../../middleware/auth.js";
const router = express.Router();

router.route('/')
    .get(isAuthUser, ClassControllers.getClass)  // Phai dang nhap moi co the xem class
    // .post(isAuthUser, ClassControllers.createClass)
    // .patch(isAuthUser, ClassControllers.updateClass)
    // .delete(isAuthUser, ClassControllers.deleteClass);
    // Phai la admin/lecturer moi co the tao, sua, xoa class

router.route('/lecturer')
    .patch(isAuthUser, ClassControllers.assignLecturer);
    // Phai la admin/lecturer moi co the assign lecturer

router.route('/enroll')
    .patch(isAuthUser, ClassControllers.enrollClass);
    // Phai la student moi co the enroll class

export default router;