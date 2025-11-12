import { Response } from "express";
import { generateToken } from "./generateToken";

interface TokenUser {
  userId: string;
  role: string;
}

export const attachCookiesToResponse = (res: Response, user: TokenUser): void => {
  const token = generateToken(user);

  // const isProduction = process.env.NODE_ENV === "production";
  // console.log("Cookie Mode:", isProduction ? "PRODUCTION" : "DEVELOPMENT");

  res.cookie("token", token, {
    httpOnly: true,
    secure: true, // true on HTTPS
    // sameSite: isProduction ? "none" : "lax",
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });
};
