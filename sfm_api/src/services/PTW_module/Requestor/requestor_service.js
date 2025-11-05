import RequestorDao from "../../../dao/PTW_module/Requestor/requestor_dao.js";

export default class RequestorService{
    static async getRequestorName(){
        try{
            const requestorNames=await RequestorDao.getRequestorName();
            return requestorNames;
        }catch(err){
            console.error('Error in getRequestorNameService: ', err);
        }
    }
}