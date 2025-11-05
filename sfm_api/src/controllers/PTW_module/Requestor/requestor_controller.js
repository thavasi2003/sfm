import RequestorService from '../../../services/PTW_module/Requestor/requestor_service.js';
import handleError from '../../../utils/pt_utils.js';

export default class RequestorController{
static async getRequestorNameController(req,res){
    try{
        const requestorName=await RequestorService.getRequestorName();
        res.json(requestorName);
    }catch(err){
        handleError(res, err);
        res.json({ status: 'failed' });
    }
    }
}