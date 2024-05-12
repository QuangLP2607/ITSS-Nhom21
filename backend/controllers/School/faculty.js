import Faculty from "../../models/School/faculty.js";

export default class FacultyControllers {
    // static async createFaculty(req, res, next) {}

    static async getFaculty(req, res, next) {
        try {
            const faculty = await Faculty.getFaculty(req, res, next);
            res.status(200).json({ faculty });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }

    static async updateFaculty(req, res, next) {
        try {
            const updatedFaculty = await Faculty.updateFaculty(req, res, next);
            res.status(200).json({ updatedFaculty });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }

    static async deleteFaculty(req, res, next) {
        try {
            const deletedFaculty = await Faculty.deleteFaculty(req, res, next);
            res.status(200).json({ deletedFaculty });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }
}