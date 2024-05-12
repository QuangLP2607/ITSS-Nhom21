import FacultyControllers from "../../controllers/School/faculty.js";
import express from "express";

const router = express.Router();

router.route('/')
    .get(FacultyControllers.getFaculty)
    // .post(FacultyControllers.createFaculty)
    // .patch(FacultyControllers.updateFaculty)
    // .delete(FacultyControllers.deleteFaculty);
    // Phai la admin moi co the tao, sua, xoa faculty

export default router;