import { Router } from "express";
import { authenticateUser } from "../middlewares/authenticateUser";
import {
  CreateList,
  GetListsByBoard,
  UpdateList,
  DeleteList,
  GetAllLists,
} from "../controllers/list.controller";

const router = Router();

router.post("/", authenticateUser, CreateList);
router.get("/", authenticateUser, GetListsByBoard);
router.get("/showAll", authenticateUser, GetAllLists);
router.put("/:listId", authenticateUser, UpdateList);
router.delete("/:listId", authenticateUser, DeleteList);

export default router;

