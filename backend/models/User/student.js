import User from "./user.js";
import client from "../../config/db.js";

export default class Student extends User {
    constructor(id, role){
        super(id, role);
        this.studentSetup();
    }

    async studentSetup(){
        try {
            const query = `
            REVOKE SELECT ON TABLE public.admin FROM "${this.id}";
            GRANT ALL PRIVILEGES ON TABLE public.enrollment TO "${this.id}";

            GRANT USAGE ON SCHEMA student TO "${this.id}";
            GRANT SELECT ON ALL TABLES IN SCHEMA student TO "${this.id}";
            GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA student TO "${this.id}";

            SET ROLE "${this.id}"
            `;
            await client.query(query);
        } catch (error) {
            throw error;
        }
    }
    
    static async readStudent(req, res, next){
        try {
            let query = `SELECT * FROM public.student`;
            // if req.query.id is undefined then it will return all students
            // else loop through the query string and add the query to the query string
            if (Object.keys(req.query).length > 0) {
                query += ' WHERE ';
                const conditions = [];
                for (const key in req.query) {
                    // Prevent SQL injection by using parameterized queries
                    conditions.push(`${key} = $${conditions.length + 1}`);
                }
                query += conditions.join(' AND ');
            }
            query += ';';
            const queryParams = Object.values(req.query);
            const { rows } = await client.query(query, queryParams);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async show_estimated_fees(req, res, next){
        try {
            if (!req.query.id) {
                const query = 'SELECT * FROM show_estimated_fees()';
                const { rows } = await client.query(query);
                return rows;
            } else {
                const query = 'SELECT * FROM show_estimated_fees($1)';
                const { rows } = await client.query(query, [req.query.id]);
                return rows;
            }
        } catch (error) {
            throw error;
        }
    }

    static async report_student(req, res, next){
        try {
            if (!req.query.id) {
                const query = 'SELECT * FROM report_student()';
                const { rows } = await client.query(query);
                return rows;
            } else {
                const query = 'SELECT * FROM report_student($1)';
                const { rows } = await client.query(query, [req.query.id]);
                return rows;
            }
        } catch (error) {
            throw error;
        }
    }

    static async updateStudent(req, res, next){
        try {
            const id = req.query.id;
            const updates = req.body;
    
            const columnsToUpdate = Object.keys(updates);
            const valuesToUpdate = Object.values(updates);
    
            let placeholders = columnsToUpdate.map((col, index) => `${col} = $${index + 1}`).join(', ');
            const query = `UPDATE public.student SET ${placeholders} WHERE id = $${columnsToUpdate.length + 1};`;
    
            const queryValues = [...valuesToUpdate, id];
            await client.query(query, queryValues);
        } catch (error) {
            throw error;
        }
    }

    static async deleteStudent(req, res, next){
        try {
        } catch (error) {
            throw error;
        }
    }

    //=======================
    static async getTimetableFromDatabase(req, res, next) {
        try {
            const { email } = req.body; 
            const query1 = `SELECT id FROM student WHERE email = $1`;
            const studentResult = await client.query(query1, [email]);
            const student_Id = studentResult.rows[0].id;
    
            const query2 = `SELECT class_id FROM enrollment WHERE student_id = $1`;    
            const classResult = await client.query(query2, [student_Id]);
            const class_ids = classResult.rows.map(row => row.class_id);
    
            const query3 = `SELECT * FROM timetable WHERE class_id = ANY($1) ORDER BY weekday`;    
            const { rows: timetable } = await client.query(query3, [class_ids]);
    
            const query4 = `SELECT class.id, subject.name FROM class
                            LEFT JOIN subject ON class.subject_id = subject.id
                            WHERE class.id = ANY($1)`;
            let subjectResult = await client.query(query4, [class_ids]);
    
            // Filter the subjectResult to contain only { id, name } objects
            subjectResult = subjectResult.rows.map(row => ({ id: row.id, name: row.name }));
    
            // Join timetable with subjectResult
            const combinedResult = timetable.map(item => {
                const subjectInfo = subjectResult.find(subject => subject.id === item.class_id);
                const startTime = item.start_time.slice(0, 2) + ':' + item.start_time.slice(2);
                const endTime = item.end_time.slice(0, 2) + ':' + item.end_time.slice(2);
                return { 
                    class_id: item.class_id,
                    weekday: item.weekday,
                    startTime: startTime,
                    endTime: endTime,
                    location: item.location,
                    subject_name: subjectInfo ? subjectInfo.name : null 
                };
            });
            return combinedResult;
        } catch (error) {
            next(error); 
        }
    }
   
    static async getClassDetailFromDatabase(req, res, next) {
        try {
            const { email, class_id } = req.body; 
            
            // Lấy thông tin giáo viên
            const query1 = `SELECT CONCAT(lecturer.first_name, ' ', lecturer.last_name) AS name, lecturer.email, lecturer.phone 
                            FROM lecturer 
                            LEFT JOIN class ON lecturer.id = class.lecturer_id 
                            WHERE class.id = $1;`;
            const lecturerInfo = await client.query(query1, [class_id]);
    
            // Lấy số học sinh trong lớp
            const query2 = `SELECT current_cap, type FROM class WHERE class.id = $1`;
            const classInfo = await client.query(query2, [class_id]);
            
            // Lấy chi tiết từng học sinh trong lớp
            const query3 = `SELECT student.id, CONCAT(student.first_name, ' ', student.last_name) AS name, program.name AS program_name, student.email  
                            FROM student
                            JOIN enrollment ON student.id = enrollment.student_id
                            JOIN program ON student.program_id = program.id 
                            WHERE class_id = $1`;
            const studentDetails = await client.query(query3, [class_id]);
    
            // Lấy ID của sinh viên dựa trên email
            const query4 = `SELECT id FROM student WHERE email = $1`;
            const studentIdResult = await client.query(query4, [email]);
            const studentId = studentIdResult.rows[0].id;
    
            // Lấy điểm cá nhân của sinh viên trong lớp
            const query5 = `SELECT midterm_score, final_score, absent_count 
                            FROM enrollment 
                            WHERE class_id = $1 AND student_id = $2`;
            const studentScores = await client.query(query5, [class_id, studentId]);
    
            // Trả về kết quả của các truy vấn
            return {
                lecturerInfo: lecturerInfo.rows,
                classInfo: classInfo.rows[0],
                studentDetails: studentDetails.rows,
                studentScores: studentScores.rows[0],
                // Trả về sĩ số bằng số lượng sinh viên vì trong database chưa cập nhật đúng sĩ số
                studentCount: studentDetails.rows.length
            };
    
        } catch (error) {
            next(error); 
        }
    }
  
    static async getSubjectFromDatabase(req, res, next) {
        try {
            const { subject_name, subject_id } = req.body; 
    
            let query1 = `SELECT class.id, class.subject_id, subject.name, class.current_cap, 
                            class.max_cap, timetable.weekday, timetable.start_time, timetable.end_time
                            FROM class 
                            JOIN subject ON class.subject_id = subject.id 
                            JOIN timetable ON class.id = timetable.class_id `;
            if (subject_name && subject_id) {
                query1 += 'WHERE (LOWER(subject.name) LIKE LOWER($1) OR LOWER(subject.id) LIKE LOWER($2) )ORDER BY subject.id';
                const { rows } = await client.query(query1, [`${subject_name}%`, `${subject_id}%`]);
                return rows;
            }
            else if (subject_name && !subject_id) {
                query1 += 'WHERE LOWER(subject.name) LIKE LOWER($1) ORDER BY subject.id';
                const { rows } = await client.query(query1, [`${subject_name}%`]);
                return rows;
            }
            else if (!subject_name && subject_id) {                    
                query1 += 'WHERE LOWER(subject.id) LIKE LOWER($1) ORDER BY subject.id';
                const { rows } = await client.query(query1, [`${subject_id}%`]);
                return rows;
            } else {
                const { rows } = await client.query(query1);
                return rows;
            }
        } catch (error) {
            next(error); 
        }
    }
}