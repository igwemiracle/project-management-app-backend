import mongoose, { Schema, Document } from "mongoose";

export interface IList extends Document {
  title: string;
  board: mongoose.Types.ObjectId;
  cards: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const listSchema = new Schema<IList>(
  {
    title: { type: String, required: true },
    board: { type: Schema.Types.ObjectId, ref: "Board", required: true },
    cards: [{ type: Schema.Types.ObjectId, ref: "Card" }],
  },
  { timestamps: true }
);

export const List = mongoose.model<IList>("List", listSchema);