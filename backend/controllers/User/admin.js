import Student from '../../models/User/student.js';
import Lecturer from '../../models/User/lecturer.js';
import UserControllers from './user.js';
import client from '../../config/db.js';
import Class from '../../models/School/class.js';
import Bcrypt from 'bcrypt';

function hashPassword(password){
    const saltRounds = 10;
    return Bcrypt.hash(password, saltRounds);
}

export default class AdminController extends UserControllers {
    static async add_Student(req, res, next) {
        try {
            const query = 'CALL add_student($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)';
            const values = [
                req.body.id,
                req.body.first_name,
                req.body.last_name,
                req.body.gender,
                req.body.birthday,
                req.body.status,
                req.body.join_date,
                req.body.address,
                req.body.email,
                req.body.phone,
                req.body.program_id,
            ];
            await client.query(query, values);
            await client.query('Update public.student set password = $1 where id = $2', [hashPassword('student'), req.body.id])
            res.status(200).json({ message: 'Student added successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async add_Lecturer(req, res, next) {
        try {
            const query = 'CALL add_lecturer($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)';
            const values = [
                req.body.id,
                req.body.first_name,
                req.body.last_name,
                req.body.gender,
                req.body.birthday,
                req.body.status,
                req.body.join_date,
                req.body.address,
                req.body.email,
                req.body.phone,
                req.body.faculty_id,
            ];
            await client.query(query, values);
            await client.query('Update public.lecturer set password = $1 where id = $2', [hashPassword('lecturer'), req.body.id])
            res.status(200).json({ message: 'Lecturer added successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async add_Subject(req, res, next) {
        try {
            const query = 'CALL add_subject($1, $2, $3, $4, $5, $6, $7)';
            const values = [
                req.body.id,
                req.body.name,
                req.body.study_credits,
                req.body.tuition_credits,
                req.body.final_weight,
                req.body.prerequisite_id,
                req.body.faculty_id,
            ];
            await client.query(query, values);
            res.status(200).json({ message: 'Subject added successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async add_Class(req, res, next) {
        try {
            const query = 'CALL add_class($1, $2, $3, $4, $5, $6, $7, $8, $9)';
            const values = [
                req.body.id,
                req.body.type,
                req.body.semester,
                req.body.require_lab,
                req.body.current_cap,
                req.body.max_cap,
                req.body.company_id,
                req.body.lecturer_id,
                req.body.subject_id,
            ];
            await client.query(query, values);
            res.status(200).json({ message: 'Class added successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async add_Timetable(req, res, next) {
        try {
            const query = 'CALL add_timetable($1, $2, $3, $4, $5)';
            const values = [
                req.body.class_id,
                req.body.weekday,
                req.body.start_time,
                req.body.end_time,
                req.body.location,
            ];
            await client.query(query, values);
            res.status(200).json({ message: 'Timetable added successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async readStudents(req, res, next) {
        try {
            res.status(200).json({
                students: await Student.readStudent(req, res, next),
                message: 'Students fetched successfully',
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
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

    static async updateStudent(req, res, next) {
        try {
            await Student.updateStudent(req, res, next);
            res.status(200).json({ message: 'Student updated successfully' });
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

    static async deleteStudent(req, res, next) {
        try {
            await Student.deleteStudent(req, res, next);
            res.status(200).json({ message: 'Student deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }

    static async deleteLecturer(req, res, next) {
        try {
            await Lecturer.deleteLecturer(req, res, next);
            res.status(200).json({ message: 'Lecturer deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }

    static async assign_lecturer(req, res, next) {
        try {
            await Class.assignLecturer(req, res, next);
            res.status(200).json({ message: 'Lecturer assigned successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async reset_gpa(req, res, next) {
        try {
            const query = 'CALL reset_gpa()';
            await client.query(query);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async report_enrolled(req, res, next) {
        try {
            if (!req.body.semester) {
                const query = 'SELECT * FROM report_enrolled();';
                const result = await client.query(query);
                res.status(200).json(result.rows);
            } else {
                const query = 'SELECT * FROM report_enrolled($1);';
                const values = [req.body.semester];
                const result = await client.query(query, values);
                res.status(200).json(result.rows);
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async report_credit_debt(req, res, next) {
        try {
            const query = 'CALL report_credit_debt()';
            await client.query(query);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async report_scholarship(req, res, next) {
        try {
            const query = 'CALL report_scholarship()';
            await client.query(query);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}