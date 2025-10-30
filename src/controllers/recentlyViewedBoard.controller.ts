import { Request, Response } from "express";
import { Board } from "../models/board.model";
import { RecentlyViewedBoard } from "../models/recentlyViewedBoard.model";

/**
 * @desc Track whenever a user views a board
 * @route POST /api/recently-viewed/:boardId
 * @access Private
 */
export const trackBoardView = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id; // populated by your auth middleware
    const { boardId } = req.params;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const board = await Board.findById(boardId);
    if (!board) return res.status(404).json({ message: "Board not found" });

    // Upsert (update or insert) the viewed record
    await RecentlyViewedBoard.findOneAndUpdate(
      { user: userId, board: boardId },
      { viewedAt: new Date() },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json({ message: "Board view tracked successfully" });
  } catch (err) {
    console.error("Error tracking board view:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Get user's recently viewed boards (most recent first)
 * @route GET /api/recently-viewed
 * @access Private
 */
export const getRecentlyViewedBoards = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const recentlyViewed = await RecentlyViewedBoard.find({ user: userId })
      .sort({ viewedAt: -1 })
      .limit(10)
      .populate({
        path: "board",
        populate: { path: "workspace", select: "name" },
      });

    return res.status(200).json({
      message: "Recently viewed boards fetched successfully",
      boards: recentlyViewed,
    });
  } catch (err) {
    console.error("Error fetching recently viewed boards:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
