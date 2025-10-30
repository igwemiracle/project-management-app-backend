import mongoose, { Schema, Document } from "mongoose";

export interface IRecentlyViewedBoard extends Document {
  user: mongoose.Types.ObjectId;
  board: mongoose.Types.ObjectId;
  viewedAt: Date;
}

const recentlyViewedBoardSchema = new Schema<IRecentlyViewedBoard>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    board: { type: Schema.Types.ObjectId, ref: "Board", required: true },
    viewedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Ensure uniqueness (so only one entry per user + board)
recentlyViewedBoardSchema.index({ user: 1, board: 1 }, { unique: true });

export const RecentlyViewedBoard = mongoose.model<IRecentlyViewedBoard>(
  "RecentlyViewedBoard",
  recentlyViewedBoardSchema
);
