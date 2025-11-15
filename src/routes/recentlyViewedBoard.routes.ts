import express from "express";
import {
  trackBoardView,
  getRecentlyViewedBoards,
} from "../controllers/recentlyViewedBoard.controller";
import { authenticateUser } from "../middlewares/authenticateUser";

const router = express.Router();

router.post("/:boardId", authenticateUser, trackBoardView);
router.get("/", authenticateUser, getRecentlyViewedBoards);

export default router;
