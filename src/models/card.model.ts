import mongoose, { Schema, Document } from "mongoose";

export interface ICard extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  list: mongoose.Types.ObjectId;
  board: mongoose.Types.ObjectId;
  position: number;
  assignedTo?: mongoose.Types.ObjectId;
  labels: string[];
  attachments: string[]; // Or a more complex attachment type if needed
  dueDate: Date | null;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  comments: mongoose.Types.ObjectId[];
}

const cardSchema = new Schema<ICard>(
  {
    title: { type: String, required: true },
    description: { type: String },
    list: { type: Schema.Types.ObjectId, ref: "List", required: true },
    board: { type: Schema.Types.ObjectId, ref: "Board", required: true },
    assignedTo: [{ type: Schema.Types.ObjectId, ref: "User" }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    position: { type: Number, default: 0 },
    labels: [{ type: String }],
    attachments: [{ type: String }], // If attachments are files, you may store URLs or IDs
    dueDate: { type: Date, default: null },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const Card = mongoose.model<ICard>("Card", cardSchema);
