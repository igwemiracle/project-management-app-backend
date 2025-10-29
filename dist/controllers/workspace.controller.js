"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveMember = exports.AddMember = exports.DeleteWorkspace = exports.UpdateWorkspace = exports.GetWorkspaceById = exports.GetWorkspaces = exports.CreateWorkspace = void 0;
const workspace_model_1 = require("../models/workspace.model");
const server_1 = require("../server");
// ✅ CREATE WORKSPACES
const CreateWorkspace = async (req, res) => {
    try {
        const { name, description, isPrivate } = req.body;
        if (!name) {
            return res.status(400).json({ message: "Workspace name is required" });
        }
        const newWorkspace = await workspace_model_1.Workspace.create({
            name,
            description,
            isPrivate: isPrivate ?? true, // default private
            createdBy: req.user?.id,
            members: [{ user: req.user?.id, role: "admin" }],
        });
        // ✅ Emit event ONLY to the creator’s workspace room
        const io = req.app.get("io");
        io.to(newWorkspace._id.toString()).emit("workspaceCreated", newWorkspace);
        res.status(201).json({ workspace: newWorkspace });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
exports.CreateWorkspace = CreateWorkspace;
// ✅ GET ALL WORKSPACES FOR USER
// export const GetWorkspaces = async (req: Request, res: Response) => {
//   try {
//     const workspaces = await Workspace.find({
//       "members.user": req.user?.id,
//     }).populate("members.user", "name email")
//       .populate("boards");
//     res.status(200).json({ workspaces });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// };
const GetWorkspaces = async (req, res) => {
    try {
        const workspaces = await workspace_model_1.Workspace.find({
            $or: [
                { owner: req.user?.id },
                { "members.user": req.user?.id }
            ]
        })
            .populate("members.user", "name email")
            .populate("boards");
        res.status(200).json({ workspaces });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
exports.GetWorkspaces = GetWorkspaces;
// ✅ GET SINGLE WORKSPACE
const GetWorkspaceById = async (req, res) => {
    try {
        const workspace = await workspace_model_1.Workspace.findById(req.params.id)
            .populate("members.user", "name email")
            .populate("boards");
        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }
        res.status(200).json({ workspace });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
exports.GetWorkspaceById = GetWorkspaceById;
// ✅ UPDATE WORKSPACE
const UpdateWorkspace = async (req, res) => {
    try {
        const { name, description } = req.body;
        const workspace = await workspace_model_1.Workspace.findById(req.params.id);
        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }
        if (workspace.createdBy.toString() !== req.user?.id) {
            return res.status(403).json({ message: "Not authorized to update workspace" });
        }
        if (name)
            workspace.name = name;
        if (description)
            workspace.description = description;
        await workspace.save();
        // ✅ Notify only members in this workspace (room)
        server_1.io.to(workspace._id.toString()).emit("workspaceUpdated", workspace);
        res.status(200).json({ workspace });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
exports.UpdateWorkspace = UpdateWorkspace;
// ✅ DELETE WORKSPACE
const DeleteWorkspace = async (req, res) => {
    try {
        const workspace = await workspace_model_1.Workspace.findById(req.params.id);
        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }
        // Only workspace creator (admin) can delete
        if (workspace.createdBy.toString() !== req.user?.id) {
            return res.status(403).json({ message: "Not authorized to delete workspace" });
        }
        await workspace.deleteOne(); // actually delete after check
        // ✅ Notify only members in this workspace (room)
        server_1.io.to(workspace._id.toString()).emit("workspaceDeleted", { workspaceId: workspace._id.toString() });
        res.status(200).json({ message: "Workspace deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
exports.DeleteWorkspace = DeleteWorkspace;
// ✅ ADD MEMBER TO WORKSPACE
const AddMember = async (req, res) => {
    try {
        const { userId, role } = req.body;
        const workspace = await workspace_model_1.Workspace.findById(req.params.id);
        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }
        // Only workspace creator (admin) can add members
        if (workspace.createdBy.toString() !== req.user?.id) {
            return res.status(403).json({ message: "Not authorized to add members" });
        }
        const isAlreadyMember = workspace.members.some((m) => m.user.toString() === userId);
        if (isAlreadyMember) {
            return res.status(400).json({ message: "User already a member" });
        }
        workspace.members.push({ user: userId, role });
        await workspace.save();
        // Emit memberAdded event
        const io = req.app.get("io");
        io.to(workspace._id.toString()).emit("memberAdded", {
            workspaceId: workspace._id.toString(),
            newMember: { user: userId, role },
        });
        res.status(200).json({ workspace });
    }
    catch (error) {
        console.error("AddMember error:", error);
        res.status(500).json({
            message: "Server error",
            error: error.message || error,
        });
    }
};
exports.AddMember = AddMember;
// ✅ REMOVE MEMBER FROM WORKSPACE
const RemoveMember = async (req, res) => {
    try {
        const { userId } = req.body;
        const workspace = await workspace_model_1.Workspace.findById(req.params.id);
        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }
        // Only workspace creator (admin) can remove members
        if (workspace.createdBy.toString() !== req.user?.id) {
            return res.status(403).json({ message: "Not authorized to remove members" });
        }
        workspace.members = workspace.members.filter((m) => m.user.toString() !== userId);
        await workspace.save();
        // ✅ Emit to the workspace room only
        const io = req.app.get("io");
        io.to(workspace._id.toString()).emit("memberRemoved", {
            workspaceId: workspace._id.toString(),
            removedUserId: userId,
        });
        res.status(200).json({ workspace });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
exports.RemoveMember = RemoveMember;
//# sourceMappingURL=workspace.controller.js.map