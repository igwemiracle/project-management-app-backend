import express from "express";
import {
  CreateWorkspace,
  GetWorkspaces,
  GetWorkspaceById,
  UpdateWorkspace,
  DeleteWorkspace,
  AddMember,
  RemoveMember,
} from "../controllers/workspace.controller";
import { authenticateUser } from "../middlewares/authenticateUser";

const router = express.Router();

router.post("/", authenticateUser, CreateWorkspace);
router.get("/", authenticateUser, GetWorkspaces);
router.get("/:id", authenticateUser, GetWorkspaceById);
router.put("/:id", authenticateUser, UpdateWorkspace);
router.delete("/:id", authenticateUser, DeleteWorkspace);
router.post("/:id/members", authenticateUser, AddMember);
router.delete("/:id/members", authenticateUser, RemoveMember);

export default router;
