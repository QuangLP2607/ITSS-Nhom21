import express from 'express';
import StudentController from '../../controllers/User/student.js';
import { isAuthUser } from '../../middleware/auth.js';
const router = express.Router();

router.route('/')
    .get(isAuthUser, StudentController.readStudent)
    .patch(isAuthUser, StudentController.updateStudent);

router.route('/estimated_fees')
    .get(isAuthUser, StudentController.show_estimated_fees);

router.route('/enrolled')
    .get(isAuthUser, StudentController.self_view_class_enrolled);

router.route('/results')
    .get(isAuthUser, StudentController.self_view_results);

router.route('/timetable')
    .get(isAuthUser, StudentController.self_view_timetable);

// Bo qua doc thong tin giang vien vi thong tin giang vien public

    router.route('/login')
        .post(StudentController.loginUser);
    router.route('/logout')
        .get(StudentController.logoutUser);

        router.route('/registration')
        .post(StudentController.getSubject); 
        
    router.route('/timetable')
        .post(StudentController.getTimetable);

    router.route('/classDetail')
        .post(StudentController.getClassDetail); 
        
export default router;