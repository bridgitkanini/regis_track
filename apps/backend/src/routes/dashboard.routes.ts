import { Router } from 'express';
import * as dashboardController from '../controllers/dashboard.controller';
import { authenticate } from '../middleware/auth.middleware';

import { Router as ExpressRouter } from 'express';

const router: ExpressRouter = Router();

// Apply authentication only - all authenticated users can access dashboard data
router.use(authenticate);

// Dashboard statistics
router.get('/stats', dashboardController.getDashboardStats);

// Activity logs with filtering
router.get('/activity-logs', dashboardController.getActivityLogs);

// Member statistics
router.get('/member-stats', dashboardController.getMemberStats);

export default router;
