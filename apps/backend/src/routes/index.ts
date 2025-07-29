import { Router } from 'express';
import authRoutes from './auth.routes';
import memberRoutes from './member.routes';
import dashboardRoutes from './dashboard.routes';
import { notFound, errorHandler } from '../middleware/error.middleware';
import { activityLogger } from '../middleware/activity-logger.middleware';

import { Router as ExpressRouter } from 'express';

const router: ExpressRouter = Router();

// API Routes
router.use('/api/auth', authRoutes);
router.use('/api/members', memberRoutes);
router.use('/api/dashboard', dashboardRoutes);

// Apply activity logger middleware to all API routes
router.use('/api', activityLogger);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Handle 404 - Not Found
router.use(notFound);

// Handle errors
router.use(errorHandler);

export default router;
