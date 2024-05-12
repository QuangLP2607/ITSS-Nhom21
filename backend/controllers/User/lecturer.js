import Student from '../../models/User/student.js';
import Lecturer from '../../models/User/lecturer.js';
import UserControllers from './user.js';

export default class LecturerController extends UserControllers{
    static async readStudents(req, res, next) {
        try {
            res.status(200).json({
                students: await Student.readStudent(req, res, next),
                message: 'Students fetched successfully',
            });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }

    static async viewClassAssigned(req, res, next) {
        try {
            const semester = req.body.semester;
            const query = 'CALL view_class_assigned($1)';
            const { rows } = await client.query(query, [semester]);
            res.status(200).json({
                classes: rows,
                message: 'Classes fetched successfully',
            });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }

    static async report_grade_distribution(req, res, next) {
        try {
            const class_id = req.body.class_id;
            const query = 'SELECT * FROM report_grade_distribution($1)';
            const { rows } = await client.query(query, [class_id]);
            res.status(200).json({
                rows,
                message: 'Grade distribution fetched successfully',
            });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }

    static async report_attendance(req, res, next) {
        try {
            const class_id = req.body.class_id;
            const query = 'SELECT * FROM report_attendance($1)';
            const { rows } = await client.query(query, [class_id]);
            res.status(200).json({
                rows,
                message: 'Attendance report fetched successfully',
            });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }

    static async readLecturers(req, res, next) {
        try {
            res.status(200).json({
                lecturers: await Lecturer.readLecturer(req, res, next),
                message: 'Lecturers fetched successfully',
            });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }

    static async updateLecturer(req, res, next) {
        try {
            await Lecturer.updateLecturer(req, res, next);
            res.status(200).json({ message: 'Lecturer updated successfully' });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }

    static async update_grade(req, res, next) {
        try {
            const query = 'CALL update_grade($1, $2, $3, $4)';
            const values = [req.body.student_id, req.body.class_id, req.body.midterm_score, req.body.final_score];
            await client.query(query, values);
            res.status(200).json({ message: 'Grade updated successfully' });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }

    static async mark_absence(req, res, next) {
        try {
            const query = 'CALL mark_absence($1, $2)';
            const values = [req.body.student_id, req.body.class_id];
            await client.query(query, values);
            res.status(200).json({ message: 'Absence marked successfully' });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }

    static async undo_absence(req, res, next) {
        try {
            const query = 'CALL undo_absence($1, $2)';
            const values = [req.body.student_id, req.body.class_id];
            await client.query(query, values);
            res.status(200).json({ message: 'Absence undone successfully' });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }
}