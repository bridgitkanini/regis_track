import { Request, Response, NextFunction } from 'express';
import { Member } from '../models';
import { ApiError } from '../middleware/error.middleware';
import { ActivityLog } from '../models/activity-log.model';

// @desc    Get all members with pagination, filtering, and sorting
// @route   GET /api/members
// @access  Private
export const getMembers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Sorting
    const sortBy = (req.query.sortBy as string) || 'createdAt';
    const sortOrder = (req.query.sortOrder as string) === 'desc' ? -1 : 1;
    const sort = { [sortBy]: sortOrder };

    // Filtering
    const filter: any = {};
    
    if (req.query.search) {
      filter.$or = [
        { firstName: { $regex: req.query.search, $options: 'i' } },
        { lastName: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.role) {
      filter.role = req.query.role;
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

    // Create member
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
    const changes: Record<string, any> = {};
    Object.keys(req.body).forEach(key => {
      if (JSON.stringify(originalMember[key]) !== JSON.stringify(req.body[key])) {
        changes[key] = {
          from: originalMember[key],
          to: req.body[key]
        };
      }
    });

    if (Object.keys(changes).length > 0) {
      await ActivityLog.create({
        action: 'update',
        collectionName: 'Member',
        documentId: member._id,
        userId: req.user._id,
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
