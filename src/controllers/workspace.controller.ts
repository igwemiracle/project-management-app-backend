import { Request, Response } from "express";
import { User } from "../models/user.model";
import { Workspace } from "../models/workspace.model";


// ✅ CREATE WORKSPACES
export const CreateWorkspace = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Workspace name is required" });
    }

    const newWorkspace = await Workspace.create({
      name,
      description,
      createdBy: req.user?.id,
      members: [{ user: req.user?.id, role: "admin" }],
    });
    res.status(201).json({ workspace: newWorkspace });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

// ✅ GET ALL WORKSPACES FOR USER
export const GetWorkspaces = async (req: Request, res: Response) => {
  try {
    const workspaces = await Workspace.find({
      "members.user": req.user?.id,
    }).populate("members.user", "name email")
      .populate("boards");;

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

    const workspace = await Workspace.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true }
    );

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

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

    res.status(200).json({ workspace });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
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
    res.status(200).json({ workspace });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
