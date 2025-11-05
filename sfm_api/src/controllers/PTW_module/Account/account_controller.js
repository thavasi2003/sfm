import AccountsService from "../../../services/PTW_module/Account/account_service.js";
import handleError from "../../../utils/pt_utils.js";
import jwt from 'jsonwebtoken';



export default class AccountsController{

    static async  getLoginInfoController(req,res){
        try{
            const {username,password} = req.body;
            if(!username || !password){
                return res.status(400).json({message: 'Username and password are required.'});
            }
            const loginInfo=await AccountsService.getLoginInfoService(username, password);
           
            if (!loginInfo) {
                return res.status(401).json({ message: 'Invalid username or password.' });
            }

            const user = loginInfo[0];
            const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: '8h' });
    
            return res.status(200).json({ status: 'success', data: { user,token } });      
        }catch(err){
            handleError(res, err);
            res.json({ status: 'failed' });
        }
    }

    static async  getAccountsNameController(req,res){
        try{
        const accountsName=await AccountsService.getAccountsNameService();
        res.json(accountsName);
    }catch(err){
        handleError(res, err);
        res.json({ status: 'failed' });
    }
 }

}