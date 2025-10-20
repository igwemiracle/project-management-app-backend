import express from "express";
import { DeleteUser, GetAllUsers, GetProfile, GetSingleUser, ShowCurrentUser } from "../controllers/user.controller";
import { authorizePermissions } from "../middlewares/authorizePermissions";
import { authenticateUser } from "../middlewares/authenticateUser";
import { authorizeRoles } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/", authenticateUser, authorizeRoles("admin"), GetAllUsers);
router.get("/profile", authenticateUser, GetProfile);

router.get("/showMe", authenticateUser, ShowCurrentUser);
router.get("/:id", authenticateUser, GetSingleUser);
router.delete("/:id", authenticateUser, authorizePermissions("admin"), DeleteUser);


export default router;