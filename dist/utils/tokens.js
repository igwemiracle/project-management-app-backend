"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * Generate access token (short lived)
 */
const generateAccessToken = (payload) => {
    const secret = process.env.JWT_ACCESS_SECRET;
    const expiresIn = (process.env.ACCESS_TOKEN_EXPIRES_IN ?? "15m");
    return jsonwebtoken_1.default.sign(payload, secret, { expiresIn });
};
exports.generateAccessToken = generateAccessToken;
/**
 * Generate refresh token (long lived)
 */
const generateRefreshToken = (payload) => {
    const secret = process.env.JWT_REFRESH_SECRET;
    const expiresIn = (process.env.REFRESH_TOKEN_EXPIRES_IN ?? "7d");
    return jsonwebtoken_1.default.sign(payload, secret, { expiresIn });
};
exports.generateRefreshToken = generateRefreshToken;
//# sourceMappingURL=tokens.js.map