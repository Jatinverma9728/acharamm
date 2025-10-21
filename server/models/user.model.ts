import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IUser {
  email: string;
  password: string;
  name: string;
  role: 'CUSTOMER' | 'ADMIN';
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends IUser, Document {}

export interface IUserModel extends Model<IUserDocument> {
  email: string;
  password: string;
  name: string;
  role: 'CUSTOMER' | 'ADMIN';
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUserDocument, IUserModel>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['CUSTOMER', 'ADMIN'],
      default: 'CUSTOMER',
    },
  },
  {
    timestamps: true, // This will add createdAt and updatedAt fields
  }
);

// Create and export the model
export const User = mongoose.model<IUserDocument, IUserModel>('User', userSchema);

export type UserDocument = ReturnType<typeof User.castObject>;
