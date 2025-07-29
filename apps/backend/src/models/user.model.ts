import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IRole } from './role.model';

const SALT_WORK_FACTOR = 10;
// Ensure JWT_SECRET is defined
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}
const JWT_SECRET: jwt.Secret = process.env.JWT_SECRET;

// Set default token expiration (7 days)
const DEFAULT_JWT_EXPIRES_IN = '7d';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || DEFAULT_JWT_EXPIRES_IN;

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: Schema.Types.ObjectId | IRole;
  isActive: boolean;
  lastLogin?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAuthToken(): string;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: 'Role',
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to generate JWT token
userSchema.methods.generateAuthToken = function (): string {
  interface JwtPayload {
    _id: string;
    username: string;
    email: string;
    role: any; // You might want to replace 'any' with a proper role type
  }
  
  const payload: JwtPayload = {
    _id: this._id.toString(),
    username: this.username,
    email: this.email,
    role: this.role,
  };
  
  // Set token expiration
  const options: jwt.SignOptions = { 
    expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn']
  };
  
  return jwt.sign(payload, JWT_SECRET, options);
};

export const User = model<IUser>('User', userSchema);
