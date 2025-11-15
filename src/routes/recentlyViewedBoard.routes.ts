import express from "express";
import {
  trackBoardView,
  getRecentlyViewedBoards,
  getFavoriteBoards,
  toggleStarBoard,
} from "../controllers/recentlyViewedBoard.controller";
import { authenticateUser } from "../middlewares/authenticateUser";

const router = express.Router();

router.post("/:boardId", authenticateUser, trackBoardView);
router.get("/", authenticateUser, getRecentlyViewedBoards);
router.get("/starred-boards", authenticateUser, getFavoriteBoards);
router.post("/starred-boards/:boardId/toggle", authenticateUser, toggleStarBoard);

export default router;
