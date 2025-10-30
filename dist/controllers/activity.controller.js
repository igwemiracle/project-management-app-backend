"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetActivities = exports.CreateActivity = void 0;
const activity_model_1 = require("../models/activity.model");
const CreateActivity = async (req, res) => {
    try {
        const { action, workspace, board } = req.body;
        if (!action) {
            return res.status(400).json({ message: "Action is required" });
        }
        const newActivity = new activity_model_1.ActivityLog({
            user: req.user?.id,
            action,
            workspace,
            board,
        });
        await newActivity.save();
        res.status(201).json({ activity: newActivity });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
exports.CreateActivity = CreateActivity;
const GetActivities = async (req, res) => {
    try {
        const { workspaceId, userId, entityType } = req.query;
        // Build a flexible filter object
        const filter = {};
        if (workspaceId)
            filter.workspace = workspaceId;
        if (userId)
            filter.user = userId;
        // ✅ Only apply RegExp if entityType is a string
        if (typeof entityType === "string" && entityType.trim() !== "") {
            filter.action = new RegExp(entityType, "i"); // Case-insensitive match (e.g., "Card", "Board")
        }
        const activities = await activity_model_1.ActivityLog.find(filter)
            .populate("user", "username email")
            .sort({ createdAt: -1 });
        res.status(200).json({ count: activities.length, activities });
    }
    catch (error) {
        console.error("Error fetching activities:", error);
        res.status(500).json({ message: "Server error", error });
    }
};
exports.GetActivities = GetActivities;
//# sourceMappingURL=activity.controller.js.map