import { Board } from "../models/board.model";
import { Request, Response } from "express";

// ✅ CREATE NEW BOARD (Authenticated)
export const CreateBoard = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }
    const newBoard = new Board({
      title,
      description,
      createdBy: req.user?.id, // req.user is available from authMiddleware
      lists: [],
    });
    await newBoard.save();
    res.status(201).json({ board: newBoard });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

// ✅ GET ALL BOARDS FOR AUTHENTICATED USER
export const GetBoards = async (req: Request, res: Response) => {
  try {
    const boards = await Board.find({ createdBy: req.user?.id })
    // .populate("list")
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
    // .populate('lists');

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

// UPDATE BOARD (Authenticated)
export const UpdateBoard = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    const boardId = req.params.id;
    const board = await Board.findById(boardId);

    //to check if board exists
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    // Ensure the board belongs to the logged-in user
    if (board.createdBy.toString() !== req.user?.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Update fields if provided
    if (title) board.title = title;
    if (description) board.description = description;

    // Save the updated board
    await board.save();
    res.status(200).json({ board });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

// DELETE BOARD (Authenticated)
export const DeleteBoard = async (req: Request, res: Response) => {
  try {
    const boardId = req.params.id;
    const board = await Board.findById(boardId);

    //to check if board exists
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    // Ensure the board belongs to the logged-in user
    if (board.createdBy.toString() !== req.user?.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Board.findByIdAndDelete(boardId);
    res.status(200).json({ message: "Board deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}