import { Request, Response } from "express";
import { ActivityLog } from "../models/activity.model";

export const CreateActivity = async (req: Request, res: Response) => {
  try {
    const { action, workspace, board } = req.body;
    if (!action) {
      return res.status(400).json({ message: "Action is required" });
    }

    const newActivity = new ActivityLog({
      user: req.user?.id,
      action,
      workspace,
      board,
    });

    await newActivity.save();
    res.status(201).json({ activity: newActivity });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const GetActivities = async (req: Request, res: Response) => {
  try {
    const { workspaceId, userId, entityType } = req.query;

    // Build a flexible filter object
    const filter: any = {};

    if (workspaceId) filter.workspace = workspaceId;
    if (userId) filter.user = userId;

    // ✅ Only apply RegExp if entityType is a string
    if (typeof entityType === "string" && entityType.trim() !== "") {
      filter.action = new RegExp(entityType, "i"); // Case-insensitive match (e.g., "Card", "Board")
    }

    const activities = await ActivityLog.find(filter)
      .populate("user", "username email")
      .sort({ createdAt: -1 });

    res.status(200).json({ count: activities.length, activities });
  } catch (error) {
    console.error("Error fetching activities:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
