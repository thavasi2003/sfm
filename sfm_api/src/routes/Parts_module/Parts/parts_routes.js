import { Router } from 'express';
import PartsController from "../../../controllers/Parts_module/Parts/parts_controller.js";
import authenticateToken from '../../../middlewares/auth.js';

const router = Router();

router.post('/add', authenticateToken, PartsController.createPartsController);
router.get('/index', authenticateToken, PartsController.getPartsController);
router.get('/view/:partId', authenticateToken, PartsController.getPartsByIdController);
router.put('/update/:partId', authenticateToken, PartsController.updatePartsController);
router.delete('/delete/:partId', authenticateToken, PartsController.deletePartsController);

export default router;
