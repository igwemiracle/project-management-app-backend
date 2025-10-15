import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
  text: string;
  card: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
}

const commentSchema = new Schema<IComment>(
  {
    text: { type: String, required: true },
    card: { type: Schema.Types.ObjectId, ref: "Card", required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const Comment = mongoose.model<IComment>("Comment", commentSchema);
