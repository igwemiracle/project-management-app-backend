"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecentlyViewedBoards = exports.trackBoardView = void 0;
const board_model_1 = require("../models/board.model");
const recentlyViewedBoard_model_1 = require("../models/recentlyViewedBoard.model");
/**
 * @desc Track whenever a user views a board
 * @route POST /api/recently-viewed/:boardId
 * @access Private
 */
const trackBoardView = async (req, res) => {
    try {
        const userId = req.user?.id; // populated by auth middleware
        const { boardId } = req.params;
        if (!userId)
            return res.status(401).json({ message: "Unauthorized" });
        const board = await board_model_1.Board.findById(boardId);
        if (!board)
            return res.status(404).json({ message: "Board not found" });
        // Upsert – update viewedAt or insert a new record
        await recentlyViewedBoard_model_1.RecentlyViewedBoard.findOneAndUpdate({ user: userId, board: boardId }, { viewedAt: new Date() }, { upsert: true, new: true, setDefaultsOnInsert: true });
        return res.status(200).json({ message: "Board view tracked successfully" });
    }
    catch (err) {
        console.error("Error tracking board view:", err);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.trackBoardView = trackBoardView;
/**
 * @desc Get user's recently viewed boards (most recent first)
 * @route GET /api/recently-viewed
 * @access Private
 *
 *  Returns **real Board objects** (the same shape the front-end already uses
 *  in BoardList) – no extra view-record `_id` is sent.
 */
const getRecentlyViewedBoards = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId)
            return res.status(401).json({ message: "Unauthorized" });
        // 1️⃣ Fetch the user’s recently viewed boards — newest first
        const viewRecords = await recentlyViewedBoard_model_1.RecentlyViewedBoard.find({ user: userId })
            .sort({ viewedAt: -1 })
            .limit(4)
            .select("board viewedAt")
            .populate({
            path: "board",
            select: "title description color isFavorite workspace",
            populate: {
                path: "workspace",
                select: "name",
            },
        })
            .lean();
        // 2️⃣ Trim old records beyond 4 to keep DB tidy
        const totalCount = await recentlyViewedBoard_model_1.RecentlyViewedBoard.countDocuments({ user: userId });
        if (totalCount > 4) {
            const toDelete = await recentlyViewedBoard_model_1.RecentlyViewedBoard.find({ user: userId })
                .sort({ viewedAt: -1 })
                .skip(4) // skip first 4, delete the rest
                .select("_id");
            const idsToDelete = toDelete.map((r) => r._id);
            if (idsToDelete.length) {
                await recentlyViewedBoard_model_1.RecentlyViewedBoard.deleteMany({ _id: { $in: idsToDelete } });
            }
        }
        // 3️⃣ Map into shape your UI expects
        const boards = viewRecords
            .filter((v) => v.board) // ignore missing/deleted boards
            .map((v) => ({
            _id: v.board._id,
            title: v.board.title,
            description: v.board.description,
            color: v.board.color,
            isFavorite: v.board.isFavorite,
            workspace: v.board.workspace,
            viewedAt: v.viewedAt,
        }));
        return res.status(200).json({
            message: "Recently viewed boards fetched successfully",
            boards,
        });
    }
    catch (err) {
        console.error("Error fetching recently viewed boards:", err);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.getRecentlyViewedBoards = getRecentlyViewedBoards;
//# sourceMappingURL=recentlyViewedBoard.controller.js.map