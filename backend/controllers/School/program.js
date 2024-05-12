import Program from "../../models/School/program.js";

export default class ProgramControllers {
    static async createProgram(req, res, next) {
        try {
            const newProgram = await Program.createProgram(req, res, next);
            res.status(201).json({ newProgram });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }

    static async getProgram(req, res, next) {
        try {
            const program = await Program.getProgram(req, res, next);
            res.status(200).json({ program });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }

    static async updateProgram(req, res, next) {
        try {
            const updatedProgram = await Program.updateProgram(req, res, next);
            res.status(200).json({ updatedProgram });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }

    static async deleteProgram(req, res, next) {
        try {
            const deletedProgram = await Program.deleteProgram(req, res, next);
            res.status(200).json({ deletedProgram });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }
}