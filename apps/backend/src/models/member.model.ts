import { Schema, model, Document } from 'mongoose';
import { IUser } from './user.model';

export interface IMember extends Document {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: Date;
  role: string;
  profilePicture?: string;
  createdBy: Schema.Types.ObjectId | IUser;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const memberSchema = new Schema<IMember>(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'Date of birth is required'],
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      trim: true,
    },
    profilePicture: {
      type: String,
      default: '',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: function (doc, ret) {
        delete ret._id;
        ret.id = doc._id;
      },
    },
  }
);

// Add a virtual for fullName
memberSchema.virtual('fullName').get(function (this: IMember) {
  return `${this.firstName} ${this.lastName}`;
});

// Add text index for search
memberSchema.index({
  firstName: 'text',
  lastName: 'text',
  email: 'text',
  role: 'text',
});

export const Member = model<IMember>('Member', memberSchema);
