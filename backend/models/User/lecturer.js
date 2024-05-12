import User from './user.js';
import client from '../../config/db.js';

export default class Lecturer extends User {
    constructor(id, role) {
        super(id, role);
        this.lecturerSetup();
    }

    async lecturerSetup() {
        try {
            const query = `
            REVOKE SELECT ON TABLE public.admin FROM "${this.id}";
            GRANT ALL PRIVILEGES ON TABLE public.enrollment TO "${this.id}";

            GRANT USAGE ON SCHEMA lecturer TO "${this.id}";
            GRANT SELECT ON ALL TABLES IN SCHEMA lecturer TO "${this.id}";
            GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA lecturer TO "${this.id}";

            SET ROLE "${this.id}";
            `;
            await client.query(query);
        } catch (error) {
            throw error;
        }
    }
    
    static async readLecturer(req, res, next) {
        try {
            let query = `SELECT * FROM public.lecturer`;

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

    static async updateLecturer(req, res, next) {
        try {
            const id = req.query.id;
            const updates = req.body;
    
            const columnsToUpdate = Object.keys(updates);
            const valuesToUpdate = Object.values(updates);
    
            let placeholders = columnsToUpdate.map((col, index) => `${col} = $${index + 1}`).join(', ');
            const query = `UPDATE public.lecturer SET ${placeholders} WHERE id = $${columnsToUpdate.length + 1};`;
    
            const queryValues = [...valuesToUpdate, id];
            await client.query(query, queryValues);
        } catch (error) {
            throw error;
        }
    }

    static async deleteLecturer(req, res, next) {
        try {
        } catch (error) {
            throw error;
        }
    }
}