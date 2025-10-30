"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authenticateUser_1 = require("../middlewares/authenticateUser");
const comment_controller_1 = require("../controllers/comment.controller");
const router = (0, express_1.Router)();
// All routes are protected
router.post("/", authenticateUser_1.authenticateUser, comment_controller_1.CreateComment);
router.get("/:cardId", authenticateUser_1.authenticateUser, comment_controller_1.GetCommentsByCard);
router.put("/:commentId", authenticateUser_1.authenticateUser, comment_controller_1.UpdateComment);
router.delete("/:commentId", authenticateUser_1.authenticateUser, comment_controller_1.DeleteComment);
exports.default = router;
//# sourceMappingURL=comment.routes.js.map