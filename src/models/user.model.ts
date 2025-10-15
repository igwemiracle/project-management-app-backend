import mongoose, { Schema, Document } from "mongoose";
import validator from "validator";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Please provide name']
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
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
  },

  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);
