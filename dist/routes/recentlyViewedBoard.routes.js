"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const recentlyViewedBoard_controller_1 = require("../controllers/recentlyViewedBoard.controller");
const authenticateUser_1 = require("../middlewares/authenticateUser");
const router = express_1.default.Router();
router.post("/:boardId", authenticateUser_1.authenticateUser, recentlyViewedBoard_controller_1.trackBoardView);
router.get("/", authenticateUser_1.authenticateUser, recentlyViewedBoard_controller_1.getRecentlyViewedBoards);
exports.default = router;
//# sourceMappingURL=recentlyViewedBoard.routes.js.map