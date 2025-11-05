import {Router} from 'express';
import PermitTypeController from '../../../controllers/PTW_module/PermitType/pt_controller.js';
import authenticateToken from '../../../middlewares/auth.js';

const router =Router();

router.post('/add',authenticateToken,PermitTypeController.createPermitType);
router.get('/fetch',authenticateToken,PermitTypeController.getPermitType);
router.put('/update/:ptId',authenticateToken,PermitTypeController.updatePermitType);
router.delete('/delete/:ptId',authenticateToken,PermitTypeController.deletePermitType);

export default router;