import mongoose, { Schema, Document } from 'mongoose';

export interface IBoard extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  color?: string;
  createdBy: mongoose.Types.ObjectId;
  lists: mongoose.Types.ObjectId[];
  workspace: mongoose.Types.ObjectId;
}

const boardSchema = new Schema<IBoard>(
  {
    title: { type: String, required: [true, 'Please provide title'] },
    description: { type: String },
    color: { type: String, default: "#3B82F6" },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    lists: [{ type: Schema.Types.ObjectId, ref: 'List' }],
    workspace: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true }, // ✅ added
  },
  {
    timestamps: true,
  }
);

export const Board = mongoose.model<IBoard>('Board', boardSchema);
