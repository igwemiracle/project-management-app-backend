"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../models/user.model");
const authenticateUser = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Authentication invalid" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // ✅ Fetch user from DB to check verification
        const user = await user_model_1.User.findById(decoded.userId);
        if (!user)
            return res.status(401).json({ message: "Authentication invalid" });
        // ✅ Check if email is verified
        if (!user.isVerified) {
            return res.status(403).json({ message: "Please verify your email before accessing this resource." });
        }
        req.user = { id: user._id.toString(), role: user.role };
        next();
    }
    catch (error) {
        return res.status(401).json({ message: "Authentication invalid" });
    }
};
exports.authenticateUser = authenticateUser;
//# sourceMappingURL=authenticateUser.js.map