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
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });
};
