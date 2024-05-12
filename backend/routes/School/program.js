import ProgramController from '../../controllers/School/program.js';
import express from 'express';
import { isAuthUser } from '../../middleware/auth.js';
const router = express.Router();

router.route('/')
    .get(isAuthUser, ProgramController.getProgram) // Phai dang nhap moi co the xem program
    // .post(ProgramController.createProgram)
    // .patch(ProgramController.updateProgram)
    // .delete(ProgramController.deleteProgram);
    // Phai la admin moi co the tao, sua, xoa program

export default router;