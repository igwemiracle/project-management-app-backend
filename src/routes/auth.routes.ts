import express from "express";
import { RegisterUser, LoginUser, VerifyEmail, LogoutUser, createAdmin } from "../controllers/auth.controller";

const router = express.Router();

router.post("/register", RegisterUser);
router.post("/login", LoginUser);
router.get("/verify-email", VerifyEmail);
router.post("/create-admin", createAdmin)
router.post("/logout", LogoutUser)


export default router;