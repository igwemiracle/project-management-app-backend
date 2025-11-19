"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authenticateUser_1 = require("../middlewares/authenticateUser");
const starredBoard_controller_1 = require("../controllers/starredBoard.controller");
const router = express_1.default.Router();
router.patch("/:id", authenticateUser_1.authenticateUser, starredBoard_controller_1.toggleFavorite);
router.get("/", authenticateUser_1.authenticateUser, starredBoard_controller_1.getFavoriteBoards);
exports.default = router;
//# sourceMappingURL=starredBoard.routes.js.map