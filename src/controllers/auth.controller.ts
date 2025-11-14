import crypto from "crypto";
import { Request, Response } from "express";
import { User } from "../models/user.model";
import bcrypt from "bcrypt";
import { attachCookiesToResponse } from "../utils/attachCookiesToResponse";
import sgMail from "@sendgrid/mail";
import fs from "fs";
import path from "path"


sgMail.setApiKey(process.env.SENDGRID_API_KEY!);


export const RegisterUser = async (req: Request, res: Response) => {
  try {
    const { fullName, username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const user = await User.create({
      fullName,
      username,
      email,
      password: hashedPassword,
      verificationToken,
      verificationExpires,
      isVerified: false,
    });

    const verificationLink = `https://project-management-app-orpin-delta.vercel.app/verify-email?token=${verificationToken}`;

    // ✅ Correct template path (works locally + on Render)
    const templatePath = path.join(process.cwd(), "templates", "verify-email.html");

    // Read template
    let htmlTemplate = fs.readFileSync(templatePath, "utf-8");

    // Replace placeholders
    htmlTemplate = htmlTemplate
      .replace(/{{username}}/g, username)
      .replace(/{{verificationLink}}/g, verificationLink)
      .replace(
        /{{workflowImage}}/g,
        "https://res.cloudinary.com/db8ezcpjh/image/upload/v1763152497/t7epyt0h6moqcpjturq9.svg"
      )
      .replace(
        /{{verifyImage}}/g,
        "https://res.cloudinary.com/db8ezcpjh/image/upload/v1763144932/jbqdf9frh7oxo0ypq2dr.jpg"
      );

    const msg = {
      to: email,
      from: process.env.SENDER_EMAIL!,
      subject: "Verify your email address",
      html: htmlTemplate,
    };

    await sgMail.send(msg);

    res.status(201).json({
      message: "User registered successfully. Please verify your email.",
      user,
    });
  } catch (error) {
    console.error("SendGrid Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


export const VerifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.query;

    if (!token) return res.status(400).json({ message: "Token is required" });
    const user = await User.findOne({ verificationToken: token });

    // Handle already verified users
    if (!user) {
      // Maybe the user has already verified, let's check
      const verifiedUser = await User.findOne({ isVerified: true });
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
    attachCookiesToResponse(res, {
      userId: user._id.toString(),
      role: user.role,
    });

    // Send response
    return res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Server error in VerifyEmail:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const LoginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    // 🚫 Block login if the user hasn't verified their email
    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email before logging in.",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    attachCookiesToResponse(res, {
      userId: user._id.toString(),
      role: user.role,
    });
    console.log("Cookie headers:", res.getHeaders()["set-cookie"]);
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
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const createAdmin = async (req: Request, res: Response) => {
  try {
    const { fullName, username, email, password, adminKey } = req.body;

    if (adminKey !== process.env.ADMIN_CREATION_KEY) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await User.create({
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
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const LogoutUser = (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",

  });
  res.status(200).json({ "success": true, message: "Logged out successfully" });
};



