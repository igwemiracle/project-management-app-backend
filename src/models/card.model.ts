import mongoose, { Schema, Document } from "mongoose";

export interface ICard extends Document {
  title: string;
  description?: string;
  board: mongoose.Types.ObjectId;
  list: mongoose.Types.ObjectId;
  assignedTo?: mongoose.Types.ObjectId;
  comments: mongoose.Types.ObjectId[];
}

const cardSchema = new Schema<ICard>(
  {
    title: { type: String, required: true },
    description: { type: String },
    list: { type: Schema.Types.ObjectId, ref: "List", required: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User" },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

export const Card = mongoose.model<ICard>("Card", cardSchema);
