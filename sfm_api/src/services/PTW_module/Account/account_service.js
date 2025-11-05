import AccountsDao from "../../../dao/PTW_module/Account/account_dao.js";

export default class AccountsService{

    static async getLoginInfoService(username, password){
        try{
            const loginInfo=await AccountsDao.getLoginInfo(username, password);
            if (loginInfo.length === 0) {
                return null;
            }      

            return loginInfo;

        }catch(err){
            console.error('Error in getLoginInfoService: ', err);
        }
    }


    static async getAccountsNameService(){
        try{
            const names=await AccountsDao.getAccountNames();
            return names;
        }catch(err){
            console.error('Error in getAccountsNameService: ', err);
        }
    }
}