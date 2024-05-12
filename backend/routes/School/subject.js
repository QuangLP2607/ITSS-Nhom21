import SubjectControllers from "../../controllers/School/subject.js";
import express from "express";
import { isAuthUser } from "../../middleware/auth.js";

const router = express.Router();

router.route('/')
    .get(isAuthUser, SubjectControllers.getSubject) // Phai dang nhap moi co the xem subject
    // .post(isAuthUser, SubjectControllers.createSubject)
    // .patch(isAuthUser, SubjectControllers.updateSubject)
    // .delete(isAuthUser, SubjectControllers.deleteSubject);
    // Phai la admin/lecturer moi co the tao, sua, xoa subject

export default router;