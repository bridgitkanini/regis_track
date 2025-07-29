import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models';
import { IUser } from '../models/user.model';
import { Document } from 'mongoose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Extend Express Request type with our custom properties
declare global {
  namespace Express {
    interface Request {
      user?: IUser & Document;
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'No token, authorization denied' });
      return;
    }

    const token = authHeader.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({ message: 'No token, authorization denied' });
      return;
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as { _id: string };
    
    // Get user from the token
    const user = await User.findById(decoded._id).select('-password');
    
    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    if (!user.isActive) {
      res.status(401).json({ message: 'User account is deactivated' });
      return;
    }

    // Attach user to request object
    req.user = user;
    next();
    return;
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Token is not valid' });
    return;
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    const roleName = typeof req.user.role === 'object' && req.user.role !== null ? 
      (req.user.role as { name: string }).name : 
      req.user.role;

    if (!roles.includes(roleName as string)) {
      res.status(403).json({ message: 'Not authorized to access this route' });
      return;
    }

    next();
    return;
  };
};
