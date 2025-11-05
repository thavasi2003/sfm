import { Router } from 'express';
import authenticateToken from '../../../middlewares/auth.js';
import EmailController from '../../../controllers/PTW_module/E-mail/email_controller.js';

const router = Router();

router.post('/send-notification',authenticateToken, EmailController.sendNotification);

export default router;
