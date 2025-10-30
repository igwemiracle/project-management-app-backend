"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const authorizePermissions_1 = require("../middlewares/authorizePermissions");
const authenticateUser_1 = require("../middlewares/authenticateUser");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
router.get("/", authenticateUser_1.authenticateUser, (0, auth_middleware_1.authorizeRoles)("admin"), user_controller_1.GetAllUsers);
router.get("/profile", authenticateUser_1.authenticateUser, user_controller_1.GetProfile);
router.get("/showMe", authenticateUser_1.authenticateUser, user_controller_1.ShowCurrentUser);
// router.get("/owned-accounts", authenticateUser, getOwnedAccounts);
// router.get("/:ownerId/owned-accounts", getPublicOwnedAccounts);
// router.post("/switch/:accountId", authenticateUser, switchAccount);
// router.post("/subaccounts", authenticateUser, createSubAccount);
router.get("/:id", authenticateUser_1.authenticateUser, user_controller_1.GetSingleUser);
router.delete("/:id", authenticateUser_1.authenticateUser, (0, authorizePermissions_1.authorizePermissions)("admin"), user_controller_1.DeleteUser);
// router.delete("/sub-accounts/:id", authenticateUser, removeSubAccount)
exports.default = router;
//# sourceMappingURL=user.routes.js.map