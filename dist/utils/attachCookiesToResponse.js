"use strict";
// import { Response } from "express";
// import { generateToken } from "./generateToken";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachCookiesToResponse = void 0;
const tokens_1 = require("./tokens");
const isProd = process.env.NODE_ENV === "production";
const attachCookiesToResponse = (res, user) => {
    const accessToken = (0, tokens_1.generateAccessToken)(user);
    // We always generate a new refresh token on login/rotation
    const refreshToken = (0, tokens_1.generateRefreshToken)(user);
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
exports.attachCookiesToResponse = attachCookiesToResponse;
//# sourceMappingURL=attachCookiesToResponse.js.map