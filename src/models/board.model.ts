import mongoose, { Schema, Document } from 'mongoose';

export interface IBoard extends Document {
  title: string;
  description?: string;
  createdBy: mongoose.Types.ObjectId;
  lists: mongoose.Types.ObjectId[];
}

const boardSchema = new Schema<IBoard>(
  {
    title: { type: String, required: [true, 'Please provide title'] },
    description: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    lists: [{ type: Schema.Types.ObjectId, ref: 'List' }],
  },
  {
    timestamps: true,
  }
);

export const Board = mongoose.model<IBoard>('Board', boardSchema);
