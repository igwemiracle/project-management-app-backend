import { Response } from "express";
import { generateToken } from "./generateToken";

interface TokenUser {
  userId: string;
  role: string;
}

export const attachCookiesToResponse = (res: Response, user: TokenUser): void => {
  const token = generateToken(user);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // only true on HTTPS prod
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000,
  });
};
