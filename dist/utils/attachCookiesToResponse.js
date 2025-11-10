"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachCookiesToResponse = void 0;
const generateToken_1 = require("./generateToken");
const attachCookiesToResponse = (res, user) => {
  const token = (0, generateToken_1.generateToken)(user);
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // only true on HTTPS prod
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000,
  });
};
exports.attachCookiesToResponse = attachCookiesToResponse;
//# sourceMappingURL=attachCookiesToResponse.js.map