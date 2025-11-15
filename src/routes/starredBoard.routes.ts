import express from 'express';

import { authenticateUser } from "../middlewares/authenticateUser";
import { getFavoriteBoards, toggleFavorite } from '../controllers/starredBoard.controller';

const router = express.Router();


router.patch("/:id", authenticateUser, toggleFavorite);
router.get("/", authenticateUser, getFavoriteBoards);
export default router;