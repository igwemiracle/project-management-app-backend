import mongoose, { Schema, Document } from "mongoose";

export interface IWorkspace extends Document {
  name: string;
  description?: string;
  createdBy: mongoose.Types.ObjectId;
  members: {
    user: mongoose.Types.ObjectId;
    role: "admin" | "member" | "viewer";
  }[];
  boards: mongoose.Types.ObjectId[];
}

const WorkspaceSchema = new Schema<IWorkspace>(
  {
    name: { type: String, required: true },
    description: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    members: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        role: { type: String, enum: ["admin", "member", "viewer"], default: "member" },
      },
    ],
    boards: [{ type: Schema.Types.ObjectId, ref: "Board" }],
  },
  { timestamps: true }
);

export const Workspace = mongoose.model<IWorkspace>("Workspace", WorkspaceSchema);