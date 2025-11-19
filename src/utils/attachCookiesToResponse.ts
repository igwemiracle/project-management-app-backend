// import { Response } from "express";
// import { generateToken } from "./generateToken";

// interface TokenUser {
//   userId: string;
//   role: string;
// }

// export const attachCookiesToResponse = (res: Response, user: TokenUser): void => {
//   const token = generateToken(user);
//   console.log("Cookie headers:", res.getHeaders()["set-cookie"]);

//   res.cookie("token", token, {
//     httpOnly: true,
//     secure: true,
//     sameSite: "none",
//     maxAge: 24 * 60 * 60 * 1000,
//   });
// };

import { Response } from "express";
import { generateAccessToken, generateRefreshToken } from "./tokens";

interface TokenUser {
  userId: string;
  role: string;
}

const isProd = process.env.NODE_ENV === "production";

export const attachCookiesToResponse = (
  res: Response,
  user: TokenUser,
) => {
  const accessToken = generateAccessToken(user);
  // We always generate a new refresh token on login/rotation
  const refreshToken = generateRefreshToken(user);

  // Set access token cookie (short lived)
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: 15 * 60 * 1000,
    path: "/",
  });

  // Set refresh token cookie (long lived)
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });

  return { accessToken, refreshToken };
};
