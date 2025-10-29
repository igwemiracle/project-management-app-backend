import express from "express";
import { authenticateUser } from "../middlewares/authenticateUser";
import { RemoveAccount, SwitchAccount } from "../controllers/account.controller";

const router = express.Router();


router.post("/switch-account", authenticateUser, SwitchAccount);
router.post("/remove-account", authenticateUser, RemoveAccount);

export default router;