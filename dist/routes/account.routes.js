"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authenticateUser_1 = require("../middlewares/authenticateUser");
const account_controller_1 = require("../controllers/account.controller");
const router = express_1.default.Router();
router.post("/switch-account", authenticateUser_1.authenticateUser, account_controller_1.SwitchAccount);
router.post("/remove-account", authenticateUser_1.authenticateUser, account_controller_1.RemoveAccount);
exports.default = router;
//# sourceMappingURL=account.routes.js.map