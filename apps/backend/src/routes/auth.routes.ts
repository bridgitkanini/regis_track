import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.use(authenticate);
router.get('/me', authController.getMe);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logout);

export default router;
