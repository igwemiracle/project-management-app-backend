import mongoose, { Schema, Document } from "mongoose";

interface IActivity extends Document {
  user: mongoose.Types.ObjectId;
  action: string;
  board?: mongoose.Types.ObjectId;
  card?: mongoose.Types.ObjectId;
  list?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const ActivitySchema = new Schema<IActivity>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true },
    board: { type: Schema.Types.ObjectId, ref: "Board" },
    card: { type: Schema.Types.ObjectId, ref: "Card" },
    list: { type: Schema.Types.ObjectId, ref: "List" },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model<IActivity>("Activity", ActivitySchema);
