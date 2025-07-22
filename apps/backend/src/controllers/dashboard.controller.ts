import { Request, Response, NextFunction } from 'express';
import { Member, ActivityLog, User } from '../models';
import { ApiError } from '../middleware/error.middleware';

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private/Admin
export const getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get total members count
    const totalMembers = await Member.countDocuments();
    
    // Get active members count
    const activeMembers = await Member.countDocuments({ status: 'active' });
    
    // Get inactive members count
    const inactiveMembers = await Member.countDocuments({ status: 'inactive' });
    
    // Get total users count (excluding admins)
    const totalUsers = await User.countDocuments({ 'role.name': { $ne: 'admin' } });
    
    // Get recent activities
    const recentActivities = await ActivityLog.find()
      .sort({ timestamp: -1 })
      .limit(10)
      .populate('userId', 'username')
      .lean();
    
    // Get member role distribution
    const roleDistribution = await Member.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    
    // Get monthly member growth
    const monthlyGrowth = await Member.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 6 },
    ]);

    res.json({
      success: true,
      data: {
        totalMembers,
        activeMembers,
        inactiveMembers,
        totalUsers,
        recentActivities,
        roleDistribution,
        monthlyGrowth,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get activity logs with filtering
// @route   GET /api/dashboard/activity-logs
// @access  Private/Admin
export const getActivityLogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    // Filtering
    const filter: any = {};
    
    if (req.query.userId) {
      filter.userId = req.query.userId;
    }
    
    if (req.query.action) {
      filter.action = req.query.action;
    }
    
    if (req.query.collectionName) {
      filter.collectionName = req.query.collectionName;
    }
    
    if (req.query.startDate || req.query.endDate) {
      filter.timestamp = {};
      if (req.query.startDate) {
        filter.timestamp.$gte = new Date(req.query.startDate as string);
      }
      if (req.query.endDate) {
        // Set end of day
        const endDate = new Date(req.query.endDate as string);
        endDate.setHours(23, 59, 59, 999);
        filter.timestamp.$lte = endDate;
      }
    }

    // Get total count for pagination
    const total = await ActivityLog.countDocuments(filter);

    // Get paginated logs
    const logs = await ActivityLog.find(filter)
      .populate('userId', 'username email')
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.json({
      success: true,
      count: logs.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: logs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get member statistics
// @route   GET /api/dashboard/member-stats
// @access  Private/Admin
export const getMemberStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get member count by status
    const statusStats = await Member.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    
    // Get member count by role
    const roleStats = await Member.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    
    // Get member creation trend (last 12 months)
    const monthlyTrend = await Member.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 },
    ]);
    
    // Get members by creator
    const creatorStats = await Member.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'createdBy',
          foreignField: '_id',
          as: 'creator',
        },
      },
      { $unwind: '$creator' },
      {
        $group: {
          _id: {
            userId: '$createdBy',
            username: '$creator.username',
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    res.json({
      success: true,
      data: {
        statusStats,
        roleStats,
        monthlyTrend,
        creatorStats,
      },
    });
  } catch (error) {
    next(error);
  }
};
