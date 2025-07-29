// This file extends the Express Request type to include our custom properties
// Using declaration merging to extend the existing types

import 'express';
import { IUser } from '../../models/user.model';
import { Document } from 'mongoose';

declare global {
  namespace Express {
    // This extends the existing Request interface
    export interface Request {
      user?: IUser & Document;
      file?: Express.Multer.File;
    }
  }
}

// This export is needed to make this file a module
export {};
