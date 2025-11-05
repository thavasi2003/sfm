import {Router} from 'express';
import RequestorController from '../../../controllers/PTW_module/Requestor/requestor_controller.js';
import authenticateToken from '../../../middlewares/auth.js';


const router=Router();
router.get('/names',authenticateToken,RequestorController.getRequestorNameController);

export default router;