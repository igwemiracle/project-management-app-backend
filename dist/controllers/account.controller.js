"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveAccount = exports.SwitchAccount = void 0;
const user_model_1 = require("../models/user.model");
const attachCookiesToResponse_1 = require("../utils/attachCookiesToResponse");
// ✅ Switch account
const SwitchAccount = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }
        const user = await user_model_1.User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Send new cookie for switched account
        (0, attachCookiesToResponse_1.attachCookiesToResponse)(res, {
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
    }
    catch (error) {
        console.error("Error switching account:", error);
        res.status(500).json({ message: "Server error switching account" });
    }
};
exports.SwitchAccount = SwitchAccount;
const RemoveAccount = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });
        res.status(200).json({ message: "Account removed from browser" });
    }
    catch (error) {
        console.error("Error removing account:", error);
        res.status(500).json({ message: "Server error removing account" });
    }
};
exports.RemoveAccount = RemoveAccount;
//# sourceMappingURL=account.controller.js.map