"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const board_controller_1 = require("../controllers/board.controller");
const authenticateUser_1 = require("../middlewares/authenticateUser");
const router = express_1.default.Router();
router.post("/", authenticateUser_1.authenticateUser, board_controller_1.CreateBoard);
router.get("/", authenticateUser_1.authenticateUser, board_controller_1.GetBoards);
router.get("/:id", authenticateUser_1.authenticateUser, board_controller_1.GetBoardById);
router.put("/:id", authenticateUser_1.authenticateUser, board_controller_1.UpdateBoard);
router.delete("/:id", authenticateUser_1.authenticateUser, board_controller_1.DeleteBoard);
exports.default = router;
//# sourceMappingURL=board.routes.js.map