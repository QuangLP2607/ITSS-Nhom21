import express from 'express';
import AdminController from '../../controllers/User/admin.js';
import { isAuthUser } from '../../middleware/auth.js';
const router = express.Router();

router.route('/student')
    .post(isAuthUser, AdminController.add_Student)
    .get(isAuthUser, AdminController.readStudents)
    // .delete(isAuthUser, AdminController.deleteStudent)
    .patch(isAuthUser, AdminController.updateStudent);
router.route('/lecturer')
    .post(isAuthUser, AdminController.add_Lecturer)
    .get(isAuthUser, AdminController.readLecturers)
    // .delete(isAuthUser, AdminController.deleteLecturer)
    .patch(isAuthUser, AdminController.updateLecturer);

router.route('/report/enrolled').get(isAuthUser, AdminController.report_enrolled)
router.route('/report/credit').get(isAuthUser, AdminController.report_credit_debt)
router.route('/report/scholarship').get(isAuthUser, AdminController.report_scholarship)

router.route('/class')
    .post(isAuthUser, AdminController.add_Class)

router.route('/subject')
    .post(isAuthUser, AdminController.add_Subject)

router.route('/login')
    .post(AdminController.loginUser);
router.route('/logout')
    .get(AdminController.logoutUser);

export default router;