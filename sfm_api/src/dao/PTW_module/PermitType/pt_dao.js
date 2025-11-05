import db from '../../../config/db_config.js';

export default class PermitTypeDao{

    static async createPermitTypeDao(permitType) {
        const sql = 'INSERT INTO m_permit_type (ptName, checklistId, flowId, reqId, remarks, active, createdby) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const values = [
            permitType.ptName,
            permitType.checklistId,
            permitType.flowId,
            permitType.reqId,
            permitType.remarks,
            permitType.active,
            permitType.createdBy
        ];


        try {
            const [result] = await db.execute(sql, values);
            return { ptId: result.insertId, ...permitType };
        } catch (err) {
            console.error('Error executing SQL:', err);
            throw err; // Ensure errors are propagated
        }
    }
    
    static async getPermitTypeDao(){
        const sql= `SELECT pt.ptId, pt.ptName,pt.checklistId, pt.flowId,pt.reqId, cl.cName AS checklistName, fl.flowName, req.reqName AS reqTag,
               pt.remarks, pt.createdOn, pt.createdBy, pt.updatedBy, pt.updatedOn, pt.active
               FROM m_permit_type pt
               LEFT JOIN m_checklist cl ON pt.checklistId = cl.checklistId
               LEFT JOIN m_flow fl ON pt.flowId = fl.flowId
               LEFT JOIN m_req_tag req ON pt.reqId = req.reqId`;
        try {
            const [rows] = await db.execute(sql);
            return rows;
        } catch (err) {
            console.error('Error executing SQL: ', err);
            throw err;
        }
    }

    static async updatePermitTypeDao(ptId,permitType){
        const sql='UPDATE m_permit_type SET ptName=?,checklistId=?, flowId=?, reqId=?, remarks=?, active=?, updatedBy=? where ptId=? ';
        const values = [
            permitType.ptName,
            permitType.checklistId,
            permitType.flowId,
            permitType.reqId,
            permitType.remarks,
            permitType.active,
            permitType.updatedBy,
            ptId
        ];
        try{
            const [result]=await db.execute(sql,values);
            return { ptId, ...permitType };
        }catch (err) {
            console.error('Error executing SQL: ', err);
            throw err;  // Re-throw the error after logging it
        }
    }

    static async deletePermitType(ptId){
        if (ptId === undefined || ptId === null) {
            throw new Error('ptId is required');
        }
        const sql='DELETE FROM m_permit_type WHERE ptId=?';
        const values=[ptId];
        try{
            await db.execute(sql,values);
            return { status: 'deletePtDao: success' };
        }catch(err){
            console.error('Error executing SQL:  ',err);
            throw err;  // Re-throw the error after logging it
        }
    }
}   