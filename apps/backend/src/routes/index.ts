import { Router } from 'express';
import authRoutes from './auth.routes';
import memberRoutes from './member.routes';
import dashboardRoutes from './dashboard.routes';
import { activityLogger } from '../middleware/activity-logger.middleware';
import { Router as ExpressRouter } from 'express';

const router: ExpressRouter = Router();

// Apply activity logger middleware to all API routes
router.use('/api', activityLogger);

// API Routes
router.use('/api/auth', authRoutes);
router.use('/api/members', memberRoutes);
router.use('/api/dashboard', dashboardRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;