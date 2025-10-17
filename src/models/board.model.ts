import mongoose, { Schema, Document } from 'mongoose';

export interface IBoard extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  createdBy: mongoose.Types.ObjectId;
  lists: mongoose.Types.ObjectId[];
  workspace: mongoose.Types.ObjectId;
}

const boardSchema = new Schema<IBoard>(
  {
    title: { type: String, required: [true, 'Please provide title'] },
    description: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    lists: [{ type: Schema.Types.ObjectId, ref: 'List' }],
    workspace: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true }, // ✅ added
  },
  {
    timestamps: true,
  }
);

export const Board = mongoose.model<IBoard>('Board', boardSchema);
