import client from '../config/db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import 'dotenv/config';

export default class mealPlan {

    static async getMealPlan(req, res, next) {
        try {
            const { groupid, mealtype, dateadded } = req.query;
            const query = `SELECT cookingplanid, recipeid, status
                           FROM cp_recipes
                           JOIN cookingplans USING (cookingplanid)
                           JOIN recipes USING (recipeid) 
                           WHERE date = $1 AND mealtype = $2 AND groupid = $3`;
            const values = [dateadded, mealtype, groupid];
            const result = await client.query(query, values);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }
    
    static async addMealPlan(req, res, next) {
        try {
            const { date, mealtype, groupid, recipeid } = req.body;
            // Kiểm tra xem đã có cooking plan nào có ngày, loại bữa ăn và nhóm trùng với thông tin đã gửi hay chưa
            let query = `SELECT cookingplanid FROM public.cookingplans WHERE date = $1 AND mealtype = $2 AND groupid = $3`;
            const { rows } = await client.query(query, [date, mealtype, groupid]);
            let cookingplanid;
            // Nếu đã có cooking plan thỏa mãn điều kiện, sử dụng cooking plan đó
            if (rows.length > 0) {
                cookingplanid = rows[0].cookingplanid;
            } else {
                // Nếu chưa có cooking plan thỏa mãn điều kiện, thêm mới cooking plan
                query = `INSERT INTO public.cookingplans(date, mealtype, groupid) VALUES ($1, $2, $3) RETURNING cookingplanid`;
                const newPlanResult = await client.query(query, [date, mealtype, groupid]);
                cookingplanid = newPlanResult.rows[0].cookingplanid;
            }
            // Thêm recipe vào cooking plan
            let query1 = `INSERT INTO public.cp_recipes(cookingplanid, recipeid, status) VALUES ($1, $2, false)`;
        await client.query(query1, [cookingplanid, recipeid]);
        } catch (error) {
            throw error;
        }
    }
    
    static async deleteRecipeMeal(req, res, next) {
        try {
            const { cookingplanid, recipeid } = req.query;
            const query = `DELETE FROM public.cp_recipes WHERE cookingplanid = $1 AND recipeid = $2`; 
            await client.query(query, [cookingplanid, recipeid]); 
        } catch (error) {
            throw error; 
        }
    }

    static async updateRecipeMeal(req, res, next) {
        try {
            const { status } = req.body;
            const { cookingplanid, recipeid } = req.query;
            const query =  `UPDATE public.cp_recipes
                            SET status = $1
                            WHERE cookingplanid = $2 AND recipeid = $3`; 
            await client.query(query, [status, cookingplanid, recipeid]);
        } catch (error) {
            throw error;
        }
    }

}