"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const router = express_1.default.Router();
router.post("/register", auth_controller_1.RegisterUser);
router.post("/login", auth_controller_1.LoginUser);
router.get("/verify-email", auth_controller_1.VerifyEmail);
router.post("/create-admin", auth_controller_1.createAdmin);
router.post("/logout", auth_controller_1.LogoutUser);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map