import { Request, Response, NextFunction } from 'express';
import { ActivityLog } from '../models';

export const activityLogger = async (req: Request, res: Response, next: NextFunction) => {
  // Skip logging for these paths
  const skipPaths = ['/api/auth/login', '/api/auth/refresh-token'];
  if (skipPaths.includes(req.path)) {
    return next();
  }

  // Get the original send function
  const originalSend = res.send;
  let responseBody: any;

  // Override the send function to capture the response body
  res.send = function (body?: any): any {
    responseBody = body;
    return originalSend.call(this, body);
  };

  // Function to log the activity
  const logActivity = async () => {
    try {
      // Skip if no user or if it's a GET request (unless it's a download)
      if (!req.user || (req.method === 'GET' && !req.path.includes('download'))) {
        return;
      }

      let action: 'create' | 'update' | 'delete' | 'login' | 'logout' = 'update';
      let collectionName: 'User' | 'Member' | 'Role' = 'Member';
      let documentId = req.params.id;
      let changes = {};

      // Determine action type based on HTTP method
      if (req.method === 'POST') {
        action = 'create';
        // For POST requests, get the ID from the response
        try {
          const response = JSON.parse(responseBody);
          documentId = response.id || documentId;
        } catch (e) {
          // If response is not JSON, use the original documentId
        }
      } else if (req.method === 'DELETE') {
        action = 'delete';
      } else if (req.path.endsWith('/login')) {
        action = 'login';
      } else if (req.path.endsWith('/logout')) {
        action = 'logout';
      }

      // Determine collection name from path
      if (req.path.includes('/users')) {
        collectionName = 'User';
      } else if (req.path.includes('/roles')) {
        collectionName = 'Role';
      }

      // For updates, capture the changes
      if (action === 'update' && req.method === 'PUT' && req.body) {
        changes = req.body;
      }

      // Create activity log
      await ActivityLog.create({
        action,
        collectionName,
        documentId,
        userId: req.user._id,
        changes: Object.keys(changes).length > 0 ? changes : undefined,
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('user-agent'),
      });
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  // Log activity after the response is sent
  res.on('finish', logActivity);
  next();
};
