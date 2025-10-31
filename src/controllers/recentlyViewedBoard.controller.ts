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
    const userId = req.user?.id; // populated by auth middleware
    const { boardId } = req.params;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const board = await Board.findById(boardId);
    if (!board) return res.status(404).json({ message: "Board not found" });

    // Upsert – update viewedAt or insert a new record
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
 *
 *  Returns **real Board objects** (the same shape the front-end already uses
 *  in BoardList) – no extra view-record `_id` is sent.
 */
export const getRecentlyViewedBoards = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    // 1. Find the view-records, sorted by newest first
    const viewRecords = await RecentlyViewedBoard.find({ user: userId })
      .sort({ viewedAt: -1 })
      .limit(10)
      .select("board viewedAt")          // we only need the board ref + timestamp
      .populate({
        path: "board",
        select: "title description color isFavorite workspace", // pick fields you need
        populate: { path: "workspace", select: "name" },
      })
      .lean();                           // <-- lean() = plain JS objects (faster)

    // 2. Map to the exact shape the UI expects
    const boards = viewRecords
      .filter((v) => v.board)               // safety – in case a board was deleted
      .map((v) => ({
        _id: (v.board as any)._id,          // real board id
        title: (v.board as any).title,
        description: (v.board as any).description,
        color: (v.board as any).color,
        isFavorite: (v.board as any).isFavorite,
        workspace: (v.board as any).workspace,
        // optional: keep the timestamp if you want to show "2h ago"
        viewedAt: v.viewedAt,
      }));

    return res.status(200).json({
      message: "Recently viewed boards fetched successfully",
      boards,                               // <-- array of real Board docs
    });
  } catch (err) {
    console.error("Error fetching recently viewed boards:", err);
    return res.status(500).json({ message: "Server error" });
  }
};