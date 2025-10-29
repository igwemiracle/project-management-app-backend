import { Router } from "express";
import { authenticateUser } from "../middlewares/authenticateUser";
import {
  CreateCard,
  GetCardsByBoard,
  // GetCards,
  UpdateCard,
  DeleteCard,
} from "../controllers/card.controller";

const router = Router();

router.post("/", authenticateUser, CreateCard);
// router.get("/:listId", authenticateUser, GetCards);
router.get("/", authenticateUser, GetCardsByBoard);
router.put("/:cardId", authenticateUser, UpdateCard);
router.delete("/:cardId", authenticateUser, DeleteCard);

export default router;
