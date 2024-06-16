import client from '../config/db.js';
import 'dotenv/config';

export default class Group {
    
    static async getGroupID(req, res, next) {
        try {
            const query = 'SELECT groupid, groupname FROM group_user JOIN groups using (groupid) WHERE userid = $1';
            const userid = [req.query.userid];
            const result = await client.query(query, userid);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async createGroup(req, res, next) {
        try {
            const { userid, groupname } = req.body;

            // Thêm nhóm mới vào bảng groups và lấy groupid của nhóm vừa tạo
            const createGroupQuery = `
                INSERT INTO public.groups (groupname)
                VALUES ($1)
                RETURNING groupid`;
            const groupResult = await client.query(createGroupQuery, [groupname]);
            const newGroupId = groupResult.rows[0].groupid;

            // Thêm thông tin vào bảng group_user để đánh dấu user là chủ nhóm mới tạo
            const addOwnerQuery = `
                INSERT INTO public.group_user (userid, groupid, isowner)
                VALUES ($1, $2, true)`;
            await client.query(addOwnerQuery, [userid, newGroupId]);

            return newGroupId; 
            
        } catch (error) {
            throw error;
        } 
    }

   
}