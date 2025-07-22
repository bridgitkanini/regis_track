import { Request, Response, NextFunction } from 'express';
import { User, Role } from '../models';
import { ApiError } from '../middleware/error.middleware';
import { ActivityLog } from '../models/activity-log.model';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email, password, role: roleName = 'user' } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      throw new ApiError(400, 'User with this email or username already exists');
    }

    // Get the default role (user)
    const role = await Role.findOne({ name: roleName });
    if (!role) {
      throw new ApiError(400, 'Invalid role');
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      role: role._id,
    });

    // Generate token
    const token = user.generateAuthToken();

    // Log the activity
    await ActivityLog.create({
      action: 'create',
      collectionName: 'User',
      documentId: user._id,
      userId: user._id,
      changes: { username, email, role: role.name },
    });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: {
          id: role._id,
          name: role.name,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email }).select('+password').populate('role', 'name');
    if (!user) {
      throw new ApiError(401, 'Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new ApiError(401, 'Account is deactivated. Please contact support.');
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new ApiError(401, 'Invalid credentials');
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = user.generateAuthToken();

    // Log the activity
    await ActivityLog.create({
      action: 'login',
      collectionName: 'User',
      documentId: user._id,
      userId: user._id,
    });

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user._id).populate('role', 'name permissions');
    
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Refresh token
// @route   POST /api/auth/refresh-token
// @access  Private
export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const token = user.generateAuthToken();

    res.json({
      success: true,
      token,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Log the activity
    await ActivityLog.create({
      action: 'logout',
      collectionName: 'User',
      documentId: req.user._id,
      userId: req.user._id,
    });

    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};
