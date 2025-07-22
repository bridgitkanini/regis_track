import { Router } from 'express';
import * as memberController from '../controllers/member.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { uploadProfilePicture, handleUploadError } from '../middleware/upload.middleware';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Member routes
router.route('/')
  .get(memberController.getMembers) // Get all members with pagination
  .post(authorize('admin'), memberController.createMember); // Create new member (admin only)

// Member photo upload route
router.post(
  '/:id/upload',
  authorize('admin'),
  uploadProfilePicture,
  handleUploadError,
  memberController.uploadProfilePicture
);

// Single member routes
router.route('/:id')
  .get(memberController.getMember) // Get single member
  .put(authorize('admin'), memberController.updateMember) // Update member (admin only)
  .delete(authorize('admin'), memberController.deleteMember); // Delete member (admin only)

export default router;
