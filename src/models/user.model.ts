import mongoose, { Schema, Document } from "mongoose";
import validator from "validator";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  fullName: string;
  username: string;
  email: string;
  password: string;
  role: "admin" | "user";
  isVerified: boolean;
  verificationToken?: string | null;
  verificationExpires?: Date | null;
  refreshToken?: string | null;

}

const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: [true, 'Please provide your full name']
    },
    username: {
      type: String,
      required: [true, 'Please provide username']
    },
    email: {
      type: String,
      required: [true, 'Please provide email'],
      validate: {
        validator: (value: string) => validator.isEmail(value),
        message: 'Please provide valid email',
      },
      unique: true
    },
    password: {
      type: String,
      required: [true, 'Please provide password']
    },
    role: {
      type: String, enum: ['admin', 'user'],
    },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String, default: null },
    verificationExpires: { type: Date, default: null },
    refreshToken: { type: String, default: null },
  },

  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);