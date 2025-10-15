import { Router } from "express";
import { authenticateUser } from "../middlewares/authenticateUser";
import {
  CreateComment,
  GetCommentsByCard,
  UpdateComment,
  DeleteComment,
} from "../controllers/comment.controller";

const router = Router();

// All routes are protected
router.post("/", authenticateUser, CreateComment);
router.get("/:cardId", authenticateUser, GetCommentsByCard);
router.put("/:commentId", authenticateUser, UpdateComment);
router.delete("/:commentId", authenticateUser, DeleteComment);

export default router;
