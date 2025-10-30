"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logActivity = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const activity_model_1 = require("../models/activity.model");
const logActivity = async ({ userId, boardId, workspaceId, entityType, entityName, actionType, details, }) => {
    try {
        if (!userId || !mongoose_1.default.Types.ObjectId.isValid(userId)) {
            console.warn("⚠️ Skipping activity log: Invalid or missing userId");
            return;
        }
        const validBoardId = boardId && mongoose_1.default.Types.ObjectId.isValid(boardId)
            ? new mongoose_1.default.Types.ObjectId(boardId)
            : undefined;
        const validWorkspaceId = workspaceId && mongoose_1.default.Types.ObjectId.isValid(workspaceId)
            ? new mongoose_1.default.Types.ObjectId(workspaceId)
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
        const newLog = new activity_model_1.ActivityLog({
            user: new mongoose_1.default.Types.ObjectId(userId),
            workspace: validWorkspaceId,
            board: validBoardId,
            entityType,
            entityName,
            action: details || actionMessage,
        });
        await newLog.save();
        console.log(`✅ Logged activity: ${actionMessage}`);
    }
    catch (error) {
        console.error("❌ Error logging activity:", error);
    }
};
exports.logActivity = logActivity;
//# sourceMappingURL=logActivity.js.map