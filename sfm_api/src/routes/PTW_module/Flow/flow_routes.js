import {Router} from 'express';
import FlowController from '../../../controllers/PTW_module/Flow/flow_controller.js';
import authenticateToken from '../../../middlewares/auth.js';

const router=Router();

router.get('/names',authenticateToken,FlowController.getAllFlowNameController);
router.get('/flowIndex',authenticateToken,FlowController.getFlowIndexController);
router.delete('/delete/:flowId',authenticateToken,FlowController.deleteFlowDetailsController);
router.post('/add',authenticateToken,FlowController.createFlowDetailsController);
router.get('/checkname',authenticateToken,FlowController.checkFlowNameController);
router.get('/flowDetails/:flowId',authenticateToken,FlowController. getFlowDetailsIndexController);
router.delete('/deleteStep/:flowId/:stepNo',authenticateToken,FlowController. deleteFlowStepController);
router.put('/updateStep/:flowId/:stepNo',authenticateToken,FlowController. updateFlowStepController);
router.post('/addStep/:flowId',authenticateToken,FlowController.addFlowStepController);
router.put('/updateFlowName/:flowId',authenticateToken,FlowController.updateFlowNameController);
router.get('/flowName/:flowId', authenticateToken,FlowController.getFlowNameController);

export default router;