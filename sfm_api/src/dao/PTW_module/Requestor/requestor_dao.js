import db from '../../../config/db_config.js';

export default class RequestorDao{
    static async getRequestorName(){
        const sql='SELECT reqId,reqName FROM m_req_tag';
        try{
            const [rows]=await db.execute(sql);
            return rows;
        }catch(err){
            console.error('Error executing SQL: ', err);
        }
    }
}