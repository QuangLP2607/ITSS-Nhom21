import Subject from "../../models/School/subject.js";

export default class SubjectControllers {
    static async createSubject(req, res, next) {
        try {
            const newSubject = await Subject.createSubject(req, res, next);
            res.status(201).json({ newSubject });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }

    static async getSubject(req, res, next) {
        try {
            const subject = await Subject.getSubject(req, res, next);
            res.status(200).json({ subject });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }

    static async updateSubject(req, res, next) {
        try {
            const updatedSubject = await Subject.updateSubject(req, res, next);
            res.status(200).json({ updatedSubject });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }

    static async deleteSubject(req, res, next) {
        try {
            const deletedSubject = await Subject.deleteSubject(req, res, next);
            res.status(200).json({ deletedSubject });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }
}