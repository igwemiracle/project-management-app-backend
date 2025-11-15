import { Request, Response } from "express";
import { Board } from "../models/board.model";
import { logActivity } from "../utils/logActivity";

/**
 * @desc Gets user's stared boards and display the first 4
 * @route GET /api/recently-viewed/starred-boards
 * @access Private
 */

export const getFavoriteBoards = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    // Get top 4 most recently updated favorite boards
    const favorites = await Board.find({
      createdBy: userId,
      isFavorite: true
    })
      .sort({ updatedAt: -1 }) // newest favorite first
      .limit(4);

    return res.status(200).json({
      success: true,
      favorites
    });
  } catch (error) {
    console.error("Get favorites error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not fetch favorite boards"
    });
  }
};

/**
 * @desc Toggle a board's favorite status
 * @route PATCH /api/:id/starred-boards
 * @access Private
 */

export const toggleFavorite = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isFavorite } = req.body;

    const board = await Board.findById(id);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    // Optional: Check ownership or workspace access if needed
    // if (board.createdBy.toString() !== req.user?.id) {
    //   return res.status(403).json({ message: "Unauthorized" });
    // }

    board.isFavorite = isFavorite;
    await board.save();

    // Optionally emit socket event if you use real-time updates
    // const io = req.app.get("io");
    // if (io && board.workspace) {
    //   io.to(board.workspace.toString()).emit("boardUpdated", { board });
    // }

    await logActivity({
      userId: req.user!.id,
      workspaceId: board.workspace.toString(),
      entityType: "Board",
      entityName: board.title,
      actionType: isFavorite ? "marked_favorite" : "unmarked_favorite",
    });

    res.status(200).json({ message: "Board favorite status updated", board });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};