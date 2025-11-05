import {Router} from 'express';
import PermitToWorkEmailController from '../../../controllers/PTW_module/PermitToWork/ptwEmail_controller.js';

const router= Router();

router.get('/permitType/:ptId/:token', PermitToWorkEmailController.getPermitToWorkByIdController);
router.post('/addResponse', PermitToWorkEmailController.addChecklistResponseController);
router.put('/updateChecklistResponse/:appId',PermitToWorkEmailController.updateChecklistResponseController);
router.put('/updateAppStatus/:appId',PermitToWorkEmailController.updateAppStatusController);
router.post('/appSignOff',PermitToWorkEmailController.insertAppSignOffController);



export default router;
