import express from "express";
import { DeleteUser, GetAllUsers, GetProfile, GetSingleUser, ShowCurrentUser } from "../controllers/user.controller";
import { authorizePermissions } from "../middlewares/authorizePermissions";
import { authenticateUser } from "../middlewares/authenticateUser";
import { authorizeRoles } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/", authenticateUser, authorizeRoles("admin"), GetAllUsers);
router.get("/profile", authenticateUser, GetProfile);

router.get("/showMe", authenticateUser, ShowCurrentUser);
// router.get("/owned-accounts", authenticateUser, getOwnedAccounts);
// router.get("/:ownerId/owned-accounts", getPublicOwnedAccounts);
// router.post("/switch/:accountId", authenticateUser, switchAccount);

// router.post("/subaccounts", authenticateUser, createSubAccount);

router.get("/:id", authenticateUser, GetSingleUser);
router.delete("/:id", authenticateUser, authorizePermissions("admin"), DeleteUser);
// router.delete("/sub-accounts/:id", authenticateUser, removeSubAccount)

export default router;