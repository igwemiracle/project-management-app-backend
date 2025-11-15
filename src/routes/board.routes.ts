import express from 'express';
import {
  CreateBoard,
  GetBoards,
  GetBoardById,
  UpdateBoard,
  DeleteBoard,
} from '../controllers/board.controller';
import { authenticateUser } from "../middlewares/authenticateUser";

const router = express.Router();

router.post("/", authenticateUser, CreateBoard);

router.get("/", authenticateUser, GetBoards);
router.get("/:id", authenticateUser, GetBoardById);
router.put("/:id", authenticateUser, UpdateBoard);
router.delete("/:id", authenticateUser, DeleteBoard);



export default router;