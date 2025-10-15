import { Router } from "express";
import { authenticateUser } from "../middlewares/authenticateUser";
import {
  CreateList,
  GetListsByBoard,
  UpdateList,
  DeleteList,
} from "../controllers/list.controller";

const router = Router();

router.post("/", authenticateUser, CreateList);
router.get("/:boardId", authenticateUser, GetListsByBoard);
router.put("/:listId", authenticateUser, UpdateList);
router.delete("/:listId", authenticateUser, DeleteList);

export default router;
