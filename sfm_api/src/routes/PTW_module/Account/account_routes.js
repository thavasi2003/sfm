import {Router} from 'express';
import AccountsController from '../../../controllers/PTW_module/Account/account_controller.js';
import authenticateToken from '../../../middlewares/auth.js';

const router=Router();

router.post('/login',AccountsController.getLoginInfoController);
router.get('/names',authenticateToken,AccountsController.getAccountsNameController);

export default router;
