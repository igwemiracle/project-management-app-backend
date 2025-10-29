import { Request, Response } from "express";
import { User } from "../models/user.model";
import { Workspace } from "../models/workspace.model";
import { io } from "../server";


// ✅ CREATE WORKSPACES
export const CreateWorkspace = async (req: Request, res: Response) => {
  try {
    const { name, description, isPrivate } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Workspace name is required" });
    }

    const newWorkspace = await Workspace.create({
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
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


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

export const GetWorkspaces = async (req: Request, res: Response) => {
  try {
    const workspaces = await Workspace.find({
      $or: [
        { owner: req.user?.id },
        { "members.user": req.user?.id }
      ]
    })
      .populate("members.user", "name email")
      .populate("boards");


    res.status(200).json({ workspaces });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ GET SINGLE WORKSPACE
export const GetWorkspaceById = async (req: Request, res: Response) => {
  try {
    const workspace = await Workspace.findById(req.params.id)
      .populate("members.user", "name email")
      .populate("boards");

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    res.status(200).json({ workspace });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


// ✅ UPDATE WORKSPACE
export const UpdateWorkspace = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    const workspace = await Workspace.findById(req.params.id);
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    if (workspace.createdBy.toString() !== req.user?.id) {
      return res.status(403).json({ message: "Not authorized to update workspace" });
    }

    if (name) workspace.name = name;
    if (description) workspace.description = description;
    await workspace.save();

    // ✅ Notify only members in this workspace (room)
    io.to(workspace._id.toString()).emit("workspaceUpdated", workspace);

    res.status(200).json({ workspace });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ DELETE WORKSPACE
export const DeleteWorkspace = async (req: Request, res: Response) => {
  try {
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    // Only workspace creator (admin) can delete
    if (workspace.createdBy.toString() !== req.user?.id) {
      return res.status(403).json({ message: "Not authorized to delete workspace" });
    }

    await workspace.deleteOne(); // actually delete after check


    // ✅ Notify only members in this workspace (room)
    io.to(workspace._id.toString()).emit("workspaceDeleted", { workspaceId: workspace._id.toString() });

    res.status(200).json({ message: "Workspace deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ ADD MEMBER TO WORKSPACE
export const AddMember = async (req: Request, res: Response) => {
  try {
    const { userId, role } = req.body;
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    // Only workspace creator (admin) can add members
    if (workspace.createdBy.toString() !== req.user?.id) {
      return res.status(403).json({ message: "Not authorized to add members" });
    }

    const isAlreadyMember = workspace.members.some(
      (m) => m.user.toString() === userId
    );
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
  } catch (error: any) {
    console.error("AddMember error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message || error,
    });
  }
};

// ✅ REMOVE MEMBER FROM WORKSPACE
export const RemoveMember = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    // Only workspace creator (admin) can remove members
    if (workspace.createdBy.toString() !== req.user?.id) {
      return res.status(403).json({ message: "Not authorized to remove members" });
    }

    workspace.members = workspace.members.filter(
      (m) => m.user.toString() !== userId
    );
    await workspace.save();

    // ✅ Emit to the workspace room only
    const io = req.app.get("io");
    io.to(workspace._id.toString()).emit("memberRemoved", {
      workspaceId: workspace._id.toString(),
      removedUserId: userId,
    });

    res.status(200).json({ workspace });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
