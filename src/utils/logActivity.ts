import mongoose from "mongoose";
import { ActivityLog } from "../models/activity.model";

interface LogActivityParams {
  userId: string;
  boardId?: string;
  workspaceId?: string;
  entityType: "Workspace" | "Board" | "List" | "Card" | "Comment";
  entityName?: string;
  actionType: "create" | "update" | "delete" | "marked_favorite" | "unmarked_favorite";
  details?: string;
}

export const logActivity = async ({
  userId,
  boardId,
  workspaceId,
  entityType,
  entityName,
  actionType,
  details,
}: LogActivityParams) => {
  try {
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      console.warn("⚠️ Skipping activity log: Invalid or missing userId");
      return;
    }

    const validBoardId =
      boardId && mongoose.Types.ObjectId.isValid(boardId)
        ? new mongoose.Types.ObjectId(boardId)
        : undefined;
    const validWorkspaceId =
      workspaceId && mongoose.Types.ObjectId.isValid(workspaceId)
        ? new mongoose.Types.ObjectId(workspaceId)
        : undefined;

    let actionMessage = "";
    switch (actionType) {
      case "create":
        actionMessage = `Created a new ${entityType}${entityName ? `: "${entityName}"` : ""}`;
        break;
      case "update":
        actionMessage = `Updated the ${entityType}${entityName ? `: "${entityName}"` : ""}`;
        break;
      case "delete":
        actionMessage = `Deleted the ${entityType}${entityName ? `: "${entityName}"` : ""}`;
        break;
      default:
        actionMessage = `Performed an action on ${entityType}`;
    }

    const newLog = new ActivityLog({
      user: new mongoose.Types.ObjectId(userId),
      workspace: validWorkspaceId,
      board: validBoardId,
      entityType,
      entityName,
      action: details || actionMessage,
    });

    await newLog.save();
    console.log(`✅ Logged activity: ${actionMessage}`);
  } catch (error) {
    console.error("❌ Error logging activity:", error);
  }
};
