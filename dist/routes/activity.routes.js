"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const activity_controller_1 = require("../controllers/activity.controller");
const authenticateUser_1 = require("../middlewares/authenticateUser");
const router = express_1.default.Router();
router.post("/", authenticateUser_1.authenticateUser, activity_controller_1.CreateActivity);
router.get("/", authenticateUser_1.authenticateUser, activity_controller_1.GetActivities);
exports.default = router;
//# sourceMappingURL=activity.routes.js.map