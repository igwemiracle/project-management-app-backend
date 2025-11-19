"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteBoard = exports.UpdateBoard = exports.GetBoardById = exports.GetBoards = exports.CreateBoard = void 0;
const board_model_1 = require("../models/board.model");
const workspace_model_1 = require("../models/workspace.model");
const logActivity_1 = require("../utils/logActivity");
const CreateBoard = async (req, res) => {
    try {
        const { title, description, workspaceId, color, isFavorite } = req.body;
        if (!title || !workspaceId) {
            return res.status(400).json({ message: "Title and workspaceId are required" });
        }
        const workspace = await workspace_model_1.Workspace.findById(workspaceId);
        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }
        const newBoard = new board_model_1.Board({
            title,
            description,
            color,
            isFavorite,
            createdBy: req.user?.id,
            workspace: workspaceId,
            lists: [],
        });
        await newBoard.save();
        // Notify members in the workspace about the new board
        const io = req.app.get("io");
        io.to(workspaceId).emit("boardCreated", { workspaceId, board: newBoard });
        // Log the action automatically
        await (0, logActivity_1.logActivity)({
            userId: req.user.id,
            workspaceId,
            entityType: "Board",
            entityName: title,
            actionType: "create",
        });
        // Push the board into the workspace
        workspace.boards.push(newBoard._id);
        await workspace.save();
        res.status(201).json({ board: newBoard });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
exports.CreateBoard = CreateBoard;
// ✅ GET ALL BOARDS FOR AUTHENTICATED USER
const GetBoards = async (req, res) => {
    try {
        const { workspace } = req.query;
        // Base query: user must own the boards
        const query = { createdBy: req.user?.id };
        // If a workspaceId is provided, filter by it
        if (workspace) {
            query.workspace = workspace;
        }
        const boards = await board_model_1.Board.find(query).populate("lists");
        res.status(200).json({ boards });
    }
    catch (error) {
        console.error("Error fetching boards:", error);
        res.status(500).json({ message: "Server error", error });
    }
};
exports.GetBoards = GetBoards;
// GET SINGLE BOARD BY ID (Authenticated)
const GetBoardById = async (req, res) => {
    try {
        const boardId = req.params.id;
        const board = await board_model_1.Board.findById(boardId)
            .populate('lists');
        if (!board) {
            return res.status(404).json({ message: "Board not found" });
        }
        // Ensure the board belongs to the logged-in user
        if (board.createdBy.toString() !== req.user?.id) {
            return res.status(403).json({ message: "Not authorized" });
        }
        res.status(200).json({ board });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
exports.GetBoardById = GetBoardById;
const UpdateBoard = async (req, res) => {
    try {
        const { title, description } = req.body;
        const boardId = req.params.id;
        const board = await board_model_1.Board.findById(boardId);
        if (!board) {
            return res.status(404).json({ message: "Board not found" });
        }
        if (board.createdBy.toString() !== req.user?.id) {
            return res.status(403).json({ message: "Not authorized" });
        }
        if (title)
            board.title = title;
        if (description)
            board.description = description;
        const updatedBoard = await board.save();
        // Notify members in the workspace about the updated board
        const io = req.app.get("io");
        io.to(board.workspace.toString()).emit("boardUpdated", { workspaceId: board.workspace.toString(), board: updatedBoard });
        // ✅ Convert ObjectId to string to match type
        await (0, logActivity_1.logActivity)({
            userId: req.user.id,
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
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
exports.UpdateBoard = UpdateBoard;
// DELETE BOARD (Authenticated)
const DeleteBoard = async (req, res) => {
    try {
        const boardId = req.params.id;
        const board = await board_model_1.Board.findById(boardId);
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
        io.to(board.workspace.toString()).emit("boardDeleted", { workspaceId: board.workspace.toString(), boardId: board._id.toString() });
        // Log activity
        await (0, logActivity_1.logActivity)({
            userId: req.user.id,
            workspaceId: board.workspace.toString(),
            entityType: "Board",
            entityName: board.title,
            actionType: "delete",
            details: `Deleted Board: "${board.title}"`,
        });
        res.status(200).json({ message: "Board deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
exports.DeleteBoard = DeleteBoard;
//# sourceMappingURL=board.controller.js.map