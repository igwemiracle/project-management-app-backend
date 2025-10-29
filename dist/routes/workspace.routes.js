"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const workspace_controller_1 = require("../controllers/workspace.controller");
const authenticateUser_1 = require("../middlewares/authenticateUser");
const router = express_1.default.Router();
router.post("/", authenticateUser_1.authenticateUser, workspace_controller_1.CreateWorkspace);
router.get("/", authenticateUser_1.authenticateUser, workspace_controller_1.GetWorkspaces);
router.get("/:id", authenticateUser_1.authenticateUser, workspace_controller_1.GetWorkspaceById);
router.put("/:id", authenticateUser_1.authenticateUser, workspace_controller_1.UpdateWorkspace);
router.delete("/:id", authenticateUser_1.authenticateUser, workspace_controller_1.DeleteWorkspace);
router.post("/:id/members", authenticateUser_1.authenticateUser, workspace_controller_1.AddMember);
router.delete("/:id/members", authenticateUser_1.authenticateUser, workspace_controller_1.RemoveMember);
exports.default = router;
//# sourceMappingURL=workspace.routes.js.map