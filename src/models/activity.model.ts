import mongoose, { Schema, Document } from "mongoose";

export interface IActivityLog extends Document {
  user: mongoose.Types.ObjectId;
  workspace?: mongoose.Types.ObjectId;
  board?: mongoose.Types.ObjectId;
  entityType: "Workspace" | "Board" | "List" | "Card" | "Comment";
  entityName?: string;
  action: string;
  createdAt: Date;
}

const ActivityLogSchema = new Schema<IActivityLog>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    workspace: { type: Schema.Types.ObjectId, ref: "Workspace" },
    board: { type: Schema.Types.ObjectId, ref: "Board" },
    entityType: {
      type: String,
      enum: ["Workspace", "Board", "List", "Card", "Comment"],
      required: true,
    },
    entityName: { type: String },
    action: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const ActivityLog = mongoose.model<IActivityLog>(
  "ActivityLog",
  ActivityLogSchema
);
