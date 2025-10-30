"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCardsByBoard = exports.DeleteCard = exports.UpdateCard = exports.CreateCard = void 0;
const card_model_1 = require("../models/card.model");
const list_model_1 = require("../models/list.model");
const logActivity_1 = require("../utils/logActivity");
const server_1 = require("../server");
const workspace_model_1 = require("../models/workspace.model");
const board_model_1 = require("../models/board.model");
// ✅ Create a new card
const CreateCard = async (req, res) => {
    try {
        const { title, description = "", listId, position = 0, assignedTo = [], labels = [], attachments = [], dueDate = null } = req.body;
        if (!title || !listId) {
            return res.status(400).json({ message: "Title and listId are required" });
        }
        const list = await list_model_1.List.findById(listId);
        if (!list)
            return res.status(404).json({ message: "List not found" });
        const board = await board_model_1.Board.findById(list.board);
        if (!board)
            return res.status(404).json({ message: "Board not found" });
        const workspace = await workspace_model_1.Workspace.findById(board.workspace);
        if (!workspace)
            return res.status(404).json({ message: "Workspace not found" });
        const newCard = new card_model_1.Card({
            title,
            description,
            list: listId,
            board: board._id,
            position,
            assignedTo,
            labels,
            attachments,
            dueDate,
            createdBy: req.user?.id
        });
        await newCard.save();
        // Add reference to the list
        await list_model_1.List.findByIdAndUpdate(listId, { $push: { cards: newCard._id } });
        // Log activity
        await (0, logActivity_1.logActivity)({
            userId: req.user.id,
            workspaceId: workspace._id.toString(),
            boardId: board._id.toString(),
            entityType: "Card",
            entityName: title,
            actionType: "create",
            details: `Created Card: "${title}"`,
        });
        // Emit event to workspace members
        const io = req.app.get("io");
        io.to(workspace._id.toString()).emit("cardCreated", newCard);
        res.status(201).json({
            card: {
                ...newCard.toObject(), // convert Mongoose doc to plain JS object
                _id: newCard._id.toString(),
                list: newCard.list.toString(),
                board: newCard.board.toString(),
                createdBy: newCard.createdBy.toString()
            }
        });
    }
    catch (error) {
        console.error("❌ Error creating card:", error);
        res.status(500).json({ message: "Server error", error });
    }
};
exports.CreateCard = CreateCard;
// ✅ Update a card
const UpdateCard = async (req, res) => {
    try {
        const { cardId } = req.params;
        const { title, description } = req.body;
        const updatedCard = await card_model_1.Card.findByIdAndUpdate(cardId, { title, description }, { new: true });
        if (!updatedCard) {
            return res.status(404).json({ message: "Card not found" });
        }
        const list = await list_model_1.List.findById(updatedCard.list);
        if (!list)
            return res.status(404).json({ message: "List not found" });
        const board = await board_model_1.Board.findById(list.board);
        if (!board)
            return res.status(404).json({ message: "Board not found" });
        const workspace = await workspace_model_1.Workspace.findById(board.workspace);
        if (!workspace)
            return res.status(404).json({ message: "Workspace not found" });
        // ✅ Log activity
        await (0, logActivity_1.logActivity)({
            userId: req.user.id,
            workspaceId: board.workspace.toString(),
            boardId: board._id.toString(),
            entityType: "Card",
            entityName: updatedCard.title,
            actionType: "update",
            details: `Updated Card: "${updatedCard.title}"`,
        });
        // ✅ Emit to only workspace members
        server_1.io.to(workspace._id.toString()).emit("cardUpdated", updatedCard);
        res.status(200).json({ card: updatedCard });
    }
    catch (error) {
        console.error("❌ Error updating card:", error);
        res.status(500).json({ message: "Server error", error });
    }
};
exports.UpdateCard = UpdateCard;
// ✅ Delete a card
const DeleteCard = async (req, res) => {
    try {
        const { cardId } = req.params;
        const card = await card_model_1.Card.findById(cardId);
        if (!card)
            return res.status(404).json({ message: "Card not found" });
        const list = await list_model_1.List.findById(card.list);
        if (!list)
            return res.status(404).json({ message: "List not found" });
        const board = await board_model_1.Board.findById(list.board);
        if (!board)
            return res.status(404).json({ message: "Board not found" });
        const workspace = await workspace_model_1.Workspace.findById(board.workspace);
        if (!workspace)
            return res.status(404).json({ message: "Workspace not found" });
        // Remove card reference from list
        await list_model_1.List.findByIdAndUpdate(card.list, { $pull: { cards: card._id } });
        await card.deleteOne();
        // ✅ Log activity
        await (0, logActivity_1.logActivity)({
            userId: req.user.id,
            workspaceId: board.workspace.toString(),
            boardId: board._id.toString(),
            entityType: "Card",
            entityName: card.title,
            actionType: "delete",
            details: `Deleted Card: "${card.title}"`,
        });
        // ✅ Emit to only workspace members
        server_1.io.to(workspace._id.toString()).emit("cardDeleted", {
            cardId: card._id,
            listId: list._id,
        });
        res.status(200).json({ message: "Card deleted successfully" });
    }
    catch (error) {
        console.error("❌ Error deleting card:", error);
        res.status(500).json({ message: "Server error", error });
    }
};
exports.DeleteCard = DeleteCard;
// ✅ Get Cards by boards
const GetCardsByBoard = async (req, res) => {
    try {
        const boardId = req.query.board;
        if (!boardId) {
            return res.status(400).json({ message: "Board ID is required" });
        }
        const cards = await card_model_1.Card.find({ board: boardId });
        res.status(200).json({ cards });
    }
    catch (error) {
        console.error("Error fetching cards:", error);
        res.status(500).json({ message: "Server error", error });
    }
};
exports.GetCardsByBoard = GetCardsByBoard;
//# sourceMappingURL=card.controller.js.map