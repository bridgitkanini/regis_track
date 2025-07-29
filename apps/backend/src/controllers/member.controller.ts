import { Request, Response, NextFunction } from 'express';
import { Member, IMember } from '../models/member.model';
import { ApiError } from '../middleware/error.middleware';
import { ActivityLog } from '../models/activity-log.model';
import { Types, Document } from 'mongoose';
import { IUser } from '../models/user.model';

// Import ParsedQs for proper query parameter typing
import { ParsedQs } from 'qs';

// Helper type for query parameters
type QueryParam = string | string[] | ParsedQs | ParsedQs[] | undefined;

// Type guard to check if value is a string
const isString = (value: unknown): value is string => {
  return typeof value === 'string' || value instanceof String;
};

// Helper function to safely get string from query
const getQueryString = (param: unknown, defaultValue: string = ''): string => {
  if (!param) return defaultValue;
  if (isString(param)) return param;
  if (Array.isArray(param)) {
    return param.length > 0 && isString(param[0]) ? param[0] : defaultValue;
  }
  if (typeof param === 'object' && param !== null) {
    return defaultValue;
  }
  return String(param);
};

// Helper function to safely get number from query
const getQueryNumber = (param: unknown, defaultValue: number): number => {
  const strValue = getQueryString(param, '');
  const num = parseInt(strValue, 10);
  return isNaN(num) ? defaultValue : num;
};

// Extend the Express Request type to include user and file
declare global {
  namespace Express {
    interface Request {
      file?: Express.Multer.File;
      user?: IUser & Document;
    }
  }
}

// @desc    Get all members with pagination, filtering, and sorting
// @route   GET /api/members
// @access  Private
export const getMembers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Use the helper functions to get query parameters with proper type assertions
    const page = getQueryNumber((req.query as any).page, 1);
    const limit = getQueryNumber((req.query as any).limit, 10);
    const skip = (page - 1) * limit;

    // Sorting with proper type assertions
    const sortBy = getQueryString((req.query as any).sortBy, 'createdAt');
    const sortOrder = getQueryString((req.query as any).sortOrder, 'asc') === 'desc' ? -1 : 1;
    const sort: { [key: string]: 1 | -1 } = {};
    sort[sortBy] = sortOrder as 1 | -1;

    // Filtering with proper types
    const filter: Record<string, unknown> = {};

    // Search with proper type assertion
    const searchTerm = getQueryString((req.query as any).search);
    if (searchTerm) {
      filter.$or = [
        { firstName: { $regex: searchTerm, $options: 'i' } },
        { lastName: { $regex: searchTerm, $options: 'i' } },
        { email: { $regex: searchTerm, $options: 'i' } },
        { phone: { $regex: searchTerm, $options: 'i' } },
      ];
    }

    // Status filter with proper type assertion
    const status = getQueryString((req.query as any).status);
    if (status) {
      filter.status = status;
    }

    // Role filter with proper type assertion
    const role = getQueryString((req.query as any).role);
    if (role) {
      filter.role = role;
    }

    // Get total count for pagination
    const total = await Member.countDocuments(filter);

    // Get paginated members
    const members = await Member.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'username');

    res.json({
      success: true,
      count: members.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: members,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single member
// @route   GET /api/members/:id
// @access  Private
export const getMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const member = await Member.findById(req.params.id).populate('createdBy', 'username');
    
    if (!member) {
      throw new ApiError(404, 'Member not found');
    }

    res.json({
      success: true,
      data: member,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new member
// @route   POST /api/members
// @access  Private
export const createMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check if member with email already exists
    const existingMember = await Member.findOne({ email: req.body.email });
    if (existingMember) {
      throw new ApiError(400, 'Member with this email already exists');
    }

    // Create member with user check
    if (!req.user) {
      throw new ApiError(401, 'Not authenticated');
    }
    
    const member = await Member.create({
      ...req.body,
      createdBy: req.user._id,
    });

    // Log the activity
    await ActivityLog.create({
      action: 'create',
      collectionName: 'Member',
      documentId: member._id,
      userId: req.user._id,
      changes: req.body,
    });

    res.status(201).json({
      success: true,
      data: member,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update member
// @route   PUT /api/members/:id
// @access  Private
export const updateMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let member = await Member.findById(req.params.id);
    
    if (!member) {
      throw new ApiError(404, 'Member not found');
    }

    // Check if email is being updated and if it's already taken
    if (req.body.email && req.body.email !== member.email) {
      const existingMember = await Member.findOne({ email: req.body.email });
      if (existingMember) {
        throw new ApiError(400, 'Email is already in use');
      }
    }

    // Store original values for activity log
    const originalMember = { ...member.toObject() };

    // Update member
    member = await Member.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    // Log the activity
    const changes: Record<string, { from: unknown; to: unknown }> = {};
    const allowedKeys: Array<keyof IMember> = ['firstName', 'lastName', 'email', 'dateOfBirth', 'role', 'status'];
    
    for (const key of allowedKeys) {
      const memberValue = originalMember[key as keyof typeof originalMember];
      const bodyValue = req.body[key];
      
      if (bodyValue !== undefined && JSON.stringify(memberValue) !== JSON.stringify(bodyValue)) {
        changes[key] = {
          from: memberValue,
          to: bodyValue
        };
      }
    }

    if (Object.keys(changes).length > 0 && member) {
      // Using non-null assertion for req.user since this is a protected route with authenticate middleware
      await ActivityLog.create({
        action: 'update',
        collectionName: 'Member',
        documentId: member._id,
        userId: req.user!._id, // Non-null assertion is safe here due to auth middleware
        changes,
      });
    }

    res.json({
      success: true,
      data: member,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete member
// @route   DELETE /api/members/:id
// @access  Private
export const deleteMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check for authenticated user
    if (!req.user) {
      throw new ApiError(401, 'Not authenticated');
    }

    const member = await Member.findById(req.params.id);
    
    if (!member) {
      throw new ApiError(404, 'Member not found');
    }

    // Log the activity before deletion
    await ActivityLog.create({
      action: 'delete',
      collectionName: 'Member',
      documentId: member._id,
      userId: req.user._id,
      changes: member.toObject(),
    });

    // Delete member
    await member.deleteOne();

    res.json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload member profile picture
// @route   POST /api/members/:id/upload
// @access  Private
export const uploadProfilePicture = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      throw new ApiError(400, 'Please upload a file');
    }

    // Check for authenticated user
    if (!req.user) {
      throw new ApiError(401, 'Not authenticated');
    }

    const member = await Member.findById(req.params.id);
    
    if (!member) {
      throw new ApiError(404, 'Member not found');
    }

    // Store the old profile picture for potential cleanup
    const oldProfilePicture = member.profilePicture;

    // Update member with new profile picture path
    member.profilePicture = `/uploads/profile-pictures/${req.file.filename}`;
    await member.save();

    // Log the activity
    await ActivityLog.create({
      action: 'update',
      collectionName: 'Member',
      documentId: member._id,
      userId: req.user._id,
      changes: {
        profilePicture: {
          from: oldProfilePicture,
          to: member.profilePicture,
        },
      },
    });

    res.json({
      success: true,
      data: {
        profilePicture: member.profilePicture,
      },
    });
  } catch (error) {
    next(error);
  }
};
