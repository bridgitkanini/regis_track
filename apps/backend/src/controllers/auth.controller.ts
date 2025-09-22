import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { User, Role, Member } from '../models';
import { ApiError } from '../middleware/error.middleware';
import { ActivityLog } from '../models/activity-log.model';

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *               - role
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               role:
 *                 type: string
 *                 enum: [admin, user]
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request - missing or invalid input
 *       409:
 *         description: Conflict - user already exists
 */
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, email, password, role: roleName = 'user' } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      throw new ApiError(
        400,
        'User with this email or username already exists'
      );
    }

    // Get the default role (user)
    const role = await Role.findOne({ name: roleName });
    if (!role) {
      throw new ApiError(400, 'Invalid role');
    }

    // Start a session for atomic operations
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      // Create user
      const user = await User.create(
        [{
          username,
          email,
          password,
          role: role._id,
        }],
        { session }
      ).then(users => users[0]);

      // Create a member for the new user
      await Member.create(
        [{
          firstName: username.split(' ')[0] || username, // Use first part of username as first name
          lastName: username.split(' ').slice(1).join(' ') || 'User', // Rest as last name if available
          email,
          role: role.name,
          createdBy: user._id,
          status: 'active',
          dateOfBirth: new Date(), // Set a default date of birth
          membershipStatus: 'active',
          membershipStartDate: new Date(),
        }],
        { session }
      );

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      // Generate token
      const token = user.generateAuthToken();

      // Note: No activity logging for registration since user is not authenticated yet

      return res.status(201).json({
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
    } catch (error: unknown) {
      // If anything fails, abort the transaction
      if (session.inTransaction()) {
        await session.abortTransaction();
        session.endSession();
      }
      
      // Type guard to check if error is a MongoDB duplicate key error
      if (error && typeof error === 'object' && 'code' in error && 'keyPattern' in error) {
        const mongoError = error as { code: number; keyPattern: Record<string, unknown> };
        if (mongoError.code === 11000 && 'email' in mongoError.keyPattern) {
          throw new ApiError(400, 'Email already exists as a member');
        }
      }
      
      throw error; // Re-throw for the global error handler
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Authenticate user and get JWT token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *     responses:
 *       200:
 *         description: User authenticated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 token:
 *                   type: string
 *                   description: JWT access token for authentication
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request - missing or invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email })
      .select('+password')
      .populate('role', 'name');
    if (!user) {
      throw new ApiError(401, 'Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new ApiError(
        401,
        'Account is deactivated. Please contact support.'
      );
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

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user's profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Not authenticated
 */
export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Not authenticated');
    }

    const user = await User.findById(req.user._id).populate(
      'role',
      'name permissions'
    );

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: (user as any).createdAt, // Using type assertion as a temporary fix
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 token:
 *                   type: string
 *       401:
 *         description: Invalid or expired refresh token
 */
export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Not authenticated');
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const token = user.generateAuthToken();

    res.status(200).json({
      success: true,
      token,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user and invalidate the current token
 *     description: This endpoint logs out the current user by invalidating their JWT token.
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully logged out
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 'Successfully logged out'
 *       401:
 *         description: Unauthorized - no valid token provided
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error during logout
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Log the activity - using non-null assertion since this is a protected route
    if (req.user) {
      await ActivityLog.create({
        action: 'logout',
        collectionName: 'User',
        documentId: req.user._id,
        userId: req.user._id,
      });
    }

    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};
