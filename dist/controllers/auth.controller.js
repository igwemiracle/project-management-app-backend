"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogoutUser = exports.createAdmin = exports.LoginUser = exports.VerifyEmail = exports.RegisterUser = void 0;
const crypto_1 = __importDefault(require("crypto"));
const user_model_1 = require("../models/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const attachCookiesToResponse_1 = require("../utils/attachCookiesToResponse");
const resend_1 = require("resend");
const resend = new resend_1.Resend(process.env.RESEND_API_KEY);
const RegisterUser = async (req, res) => {
    try {
        const { fullName, username, email, password } = req.body;
        const existingUser = await user_model_1.User.findOne({ email });
        if (existingUser)
            return res.status(400).json({ message: "Email already in use" });
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const verificationToken = crypto_1.default.randomBytes(32).toString("hex");
        const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const user = await user_model_1.User.create({
            fullName,
            username,
            email,
            password: hashedPassword,
            verificationToken,
            verificationExpires,
            isVerified: false,
        });
        // ✅ Respond to frontend immediately
        res.status(201).json({
            message: "User registered successfully. Please verify your email.",
            user: { id: user._id, email: user.email },
        });
        // ✅ Send verification email asynchronously
        const verificationLink = `http://localhost:5173/verify-email?token=${verificationToken}`;
        resend.emails.send({
            from: "Planora <onboarding@resend.dev>",
            to: email,
            subject: "Verify your email address",
            html: `
        <div style="font-family: sans-serif; line-height: 1.5;">
          <h2>Welcome, ${username}!</h2>
          <p>Please verify your email by clicking the link below:</p>
          <p><a href="${verificationLink}" target="_blank" rel="noopener noreferrer">Verify Email</a></p>
          <br />
          <p>If you didn’t sign up for Planora, please ignore this email.</p>
        </div>
      `,
        }).then(() => {
            console.log("✅ Verification email sent via Resend to:", email);
        }).catch((err) => {
            console.error("❌ Error sending email via Resend:", err);
        });
    }
    catch (error) {
        console.error("Register error:", error);
        res.status(500).json({ message: "Server error", error });
    }
};
exports.RegisterUser = RegisterUser;
const VerifyEmail = async (req, res) => {
    try {
        const { token } = req.query;
        if (!token)
            return res.status(400).json({ message: "Token is required" });
        const user = await user_model_1.User.findOne({ verificationToken: token });
        // Handle already verified users
        if (!user) {
            // Maybe the user has already verified, let's check
            const verifiedUser = await user_model_1.User.findOne({ isVerified: true });
            if (verifiedUser) {
                return res.status(200).json({ message: "Already verified" });
            }
            return res.status(400).json({ message: "Invalid or expired token" });
        }
        if (user.verificationExpires && user.verificationExpires < new Date()) {
            return res.status(400).json({ message: "Token has expired" });
        }
        if (user.isVerified) {
            return res.status(200).json({ message: "Already verified" });
        }
        // ✅ Mark as verified
        user.isVerified = true;
        user.verificationToken = null;
        user.verificationExpires = null;
        await user.save();
        // ✅ Attach cookie now that user is verified
        (0, attachCookiesToResponse_1.attachCookiesToResponse)(res, {
            userId: user._id.toString(),
            role: user.role,
        });
        // Send response
        return res.status(200).json({ message: "Email verified successfully" });
    }
    catch (error) {
        console.error("Server error in VerifyEmail:", error);
        res.status(500).json({ message: "Server error", error });
    }
};
exports.VerifyEmail = VerifyEmail;
const LoginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await user_model_1.User.findOne({ email });
        if (!user)
            return res.status(401).json({ message: "Invalid credentials" });
        // 🚫 Block login if the user hasn't verified their email
        if (!user.isVerified) {
            return res.status(403).json({
                message: "Please verify your email before logging in.",
            });
        }
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch)
            return res.status(401).json({ message: "Invalid credentials" });
        (0, attachCookiesToResponse_1.attachCookiesToResponse)(res, {
            userId: user._id.toString(),
            role: user.role,
        });
        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                fullName: user.fullName,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
exports.LoginUser = LoginUser;
const createAdmin = async (req, res) => {
    try {
        const { fullName, username, email, password, adminKey } = req.body;
        if (adminKey !== process.env.ADMIN_CREATION_KEY) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const admin = await user_model_1.User.create({
            fullName,
            username,
            email,
            password: hashedPassword,
            role: "admin",
            isVerified: true,
            verificationToken: null,
            verificationExpires: null,
        });
        res.status(201).json({ message: "Admin created", admin });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
exports.createAdmin = createAdmin;
const LogoutUser = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
    });
    res.status(200).json({ "success": true, message: "Logged out successfully" });
};
exports.LogoutUser = LogoutUser;
//# sourceMappingURL=auth.controller.js.map