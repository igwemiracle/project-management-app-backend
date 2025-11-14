"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachCookiesToResponse = void 0;
const generateToken_1 = require("./generateToken");
const attachCookiesToResponse = (res, user) => {
    const token = (0, generateToken_1.generateToken)(user);
    console.log("Cookie headers:", res.getHeaders()["set-cookie"]);
    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
    });
};
exports.attachCookiesToResponse = attachCookiesToResponse;
//# sourceMappingURL=attachCookiesToResponse.js.map