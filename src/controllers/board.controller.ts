import { Board } from "../models/board.model";
import { Request, Response } from "express";
import { Workspace } from "../models/workspace.model";
import { logActivity } from "../utils/logActivity";


export const CreateBoard = async (req: Request, res: Response) => {
  try {
    const { title, description, workspaceId } = req.body;

    if (!title || !workspaceId) {
      return res.status(400).json({ message: "Title and workspaceId are required" });
    }

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    const newBoard = new Board({
      title,
      description,
      createdBy: req.user?.id,
      workspace: workspaceId,
      lists: [],
    });

    await newBoard.save();

    // Notify members in the workspace about the new board
    const io = req.app.get("io");
    io.to(workspaceId).emit("boardCreated", { workspaceId, board: newBoard });

    // Log the action automatically
    await logActivity({
      userId: req.user!.id,
      workspaceId,
      entityType: "Board",
      entityName: title,
      actionType: "create",
    });

    // Push the board into the workspace
    workspace.boards.push(newBoard._id as import("mongoose").Types.ObjectId);
    await workspace.save();

    res.status(201).json({ board: newBoard });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ GET ALL BOARDS FOR AUTHENTICATED USER
export const GetBoards = async (req: Request, res: Response) => {
  try {
    const boards = await Board.find({ createdBy: req.user?.id })
      .populate("lists")
    res.status(200).json({ boards });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

// GET SINGLE BOARD BY ID (Authenticated)
export const GetBoardById = async (req: Request, res: Response) => {
  try {
    const boardId = req.params.id;
    const board = await Board.findById(boardId)
      .populate('lists');

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    // Ensure the board belongs to the logged-in user
    if (board.createdBy.toString() !== req.user?.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.status(200).json({ board });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

export const UpdateBoard = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    const boardId = req.params.id;

    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    if (board.createdBy.toString() !== req.user?.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (title) board.title = title;
    if (description) board.description = description;

    const updatedBoard = await board.save();

    // Notify members in the workspace about the updated board
    const io = req.app.get("io");
    io.to(board.workspace.toString()).emit("boardUpdated",
      { workspaceId: board.workspace.toString(), board: updatedBoard });

    // ✅ Convert ObjectId to string to match type
    await logActivity({
      userId: req.user!.id,
      workspaceId: board.workspace.toString(),
      entityType: "Board",
      entityName: updatedBoard.title,
      actionType: "update",
      details: `Updated Board: "${updatedBoard.title}"`,
    });

    res.status(200).json({
      message: "Board updated successfully",
      board: updatedBoard,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// DELETE BOARD (Authenticated)
export const DeleteBoard = async (req: Request, res: Response) => {
  try {
    const boardId = req.params.id;

    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    // Ensure user owns the board
    if (board.createdBy.toString() !== req.user?.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await board.deleteOne();

    // Notify members in the workspace about the deleted board
    const io = req.app.get("io");
    io.to(board.workspace.toString()).emit("boardDeleted",
      { workspaceId: board.workspace.toString(), boardId: board._id.toString() });

    // Log activity
    await logActivity({
      userId: req.user!.id,
      workspaceId: board.workspace.toString(),
      entityType: "Board",
      entityName: board.title,
      actionType: "delete",
      details: `Deleted Board: "${board.title}"`,
    });

    res.status(200).json({ message: "Board deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
