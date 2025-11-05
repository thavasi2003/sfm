import {Router} from 'express';
import ChecklistController from '../../../controllers/PTW_module/Checklist/checklist_controller.js';
import authenticateToken from '../../../middlewares/auth.js';

const router=Router();

router.get('/names',authenticateToken,ChecklistController.getChecklistNameController);
export default router;
