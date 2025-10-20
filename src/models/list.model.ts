import mongoose, { Schema, Document } from "mongoose";

export interface IList extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  board: mongoose.Types.ObjectId;
  cards: mongoose.Types.ObjectId[];
  position: number;
  createdAt: Date;
}

const listSchema = new Schema<IList>(
  {
    title: { type: String, required: true },
    board: { type: Schema.Types.ObjectId, ref: "Board", required: true },
    cards: [{ type: Schema.Types.ObjectId, ref: "Card" }],
    position: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const List = mongoose.model<IList>("List", listSchema);