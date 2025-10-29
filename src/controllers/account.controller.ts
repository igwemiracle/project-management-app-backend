import { Request, Response } from "express";
import { User } from "../models/user.model";
import { attachCookiesToResponse } from "../utils/attachCookiesToResponse";


// ✅ Switch account
export const SwitchAccount = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send new cookie for switched account
    attachCookiesToResponse(res, {
      userId: user._id.toString(),
      role: user.role,
    });

    res.status(200).json({
      message: "Switched account successfully",
      user: {
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error: any) {
    console.error("Error switching account:", error);
    res.status(500).json({ message: "Server error switching account" });
  }
};


export const RemoveAccount = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({ message: "Account removed from browser" });
  } catch (error: any) {
    console.error("Error removing account:", error);
    res.status(500).json({ message: "Server error removing account" });
  }
};
