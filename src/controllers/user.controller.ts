import { User } from "../models/user.model";
import { Request, Response } from "express";


// ✅ GET ALL USERS (Admin only)
export const GetAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({ role: "user" })
      .select("-password")

    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ GET SINGLE USER (Authenticated)
export const GetSingleUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    // Only the user themselves or an admin can view
    if (req.user?.id !== userId && req.user?.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to view this user" });
    }

    const user = await User.findById(userId)
      .select("-password")
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ SHOW CURRENT USER (Authenticated)
export const ShowCurrentUser = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const currentUser = await User.findById(req.user.id).select("-password");

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user: currentUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


// ✅ DELETE USER (Admin only)
export const DeleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};



