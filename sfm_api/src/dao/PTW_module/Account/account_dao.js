import db from '../../../config/db_config.js';


export default class AccountsDao{

    static async getLoginInfo(username, password){
        const sql=`SELECT userId, userName,displayName,companyName,role,emailId
                  FROM account WHERE userName=? AND password=?`;
        try{
            const [rows] = await db.execute(sql, [username, password]);
            return rows;
        }catch(err){
            console.error('Error executing SQL: ', err);
        }
    }


    static async getAccountNames(){
        const sql='SELECT userId,displayName FROM account';
        try{
            const [rows] =await db.execute(sql);
            return rows;
         }catch(err){
            console.error('Error executing SQL: ', err);
        }
    }
}