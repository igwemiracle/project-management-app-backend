"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCommentsByCard = exports.DeleteComment = exports.UpdateComment = exports.CreateComment = void 0;
const comment_model_1 = require("../models/comment.model");
const card_model_1 = require("../models/card.model");
const workspace_model_1 = require("../models/workspace.model");
const list_model_1 = require("../models/list.model");
// ✅ Create a comment
const CreateComment = async (req, res) => {
    try {
        const { text, cardId } = req.body;
        if (!text || !cardId) {
            return res.status(400).json({ message: "Text and cardId are required" });
        }
        const card = await card_model_1.Card.findById(cardId);
        if (!card)
            return res.status(404).json({ message: "Card not found" });
        const list = await list_model_1.List.findById(card.list).populate({
            path: "board",
            select: "workspace",
        });
        if (!list)
            return res.status(404).json({ message: "List not found" });
        const workspaceId = list.board.workspace.toString();
        if (!card)
            return res.status(404).json({ message: "Card not found" });
        const workspace = await workspace_model_1.Workspace.findById(workspaceId);
        if (!workspace)
            return res.status(404).json({ message: "Workspace not found" });
        const isMember = workspace.createdBy.toString() === req.user?.id ||
            workspace.members.some((m) => m.user.toString() === req.user?.id);
        if (!isMember) {
            return res.status(403).json({ message: "Not authorized to comment in this workspace" });
        }
        const newComment = new comment_model_1.Comment({
            text,
            card: cardId,
            createdBy: req.user?.id,
        });
        await newComment.save();
        await card_model_1.Card.findByIdAndUpdate(cardId, { $push: { comments: newComment._id } });
        // Emit to workspace members
        const io = req.app.get("io");
        io.to(workspaceId.toString()).emit("commentCreated", {
            workspaceId: workspaceId.toString(),
            comment: newComment,
        });
        res.status(201).json({ comment: newComment });
    }
    catch (error) {
        console.error("Error creating comment:", error);
        res.status(500).json({ message: "Server error", error });
    }
};
exports.CreateComment = CreateComment;
// ✅ Update a comment
const UpdateComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { text } = req.body;
        // Step 1️⃣: Find the comment
        const comment = await comment_model_1.Comment.findById(commentId);
        if (!comment)
            return res.status(404).json({ message: "Comment not found" });
        // Step 2️⃣: Get the card and list to trace the workspace
        const card = await card_model_1.Card.findById(comment.card);
        if (!card)
            return res.status(404).json({ message: "Card not found" });
        const list = await list_model_1.List.findById(card.list).populate({
            path: "board",
            select: "workspace createdBy members",
        });
        if (!list)
            return res.status(404).json({ message: "List not found" });
        if (!list.board)
            return res.status(404).json({ message: "Board not found" });
        const workspaceId = list.board.workspace.toString();
        // Step 3️⃣: Verify workspace membership
        const workspace = await workspace_model_1.Workspace.findById(workspaceId);
        if (!workspace)
            return res.status(404).json({ message: "Workspace not found" });
        const isMember = workspace.createdBy.toString() === req.user?.id ||
            workspace.members.some((m) => m.user.toString() === req.user?.id);
        if (!isMember) {
            return res.status(403).json({
                message: "Not authorized to update comment in this workspace",
            });
        }
        // Step 4️⃣: Update and save comment
        comment.text = text;
        await comment.save();
        // Step 5️⃣: Emit socket event
        const io = req.app.get("io");
        io.to(workspaceId).emit("commentUpdated", {
            workspaceId,
            comment,
        });
        res.status(200).json({ comment });
    }
    catch (error) {
        console.error("Error updating comment:", error);
        res.status(500).json({ message: "Server error", error });
    }
};
exports.UpdateComment = UpdateComment;
// ✅ Delete a comment
const DeleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        // Step 1️⃣: Find the comment
        const comment = await comment_model_1.Comment.findById(commentId);
        if (!comment)
            return res.status(404).json({ message: "Comment not found" });
        // Step 2️⃣: Get card and list to trace workspace
        const card = await card_model_1.Card.findById(comment.card);
        if (!card)
            return res.status(404).json({ message: "Card not found" });
        const list = await list_model_1.List.findById(card.list).populate({
            path: "board",
            select: "workspace createdBy members",
        });
        if (!list)
            return res.status(404).json({ message: "List not found" });
        if (!list.board)
            return res.status(404).json({ message: "Board not found" });
        const workspaceId = list.board.workspace.toString();
        // Step 3️⃣: Check membership
        const workspace = await workspace_model_1.Workspace.findById(workspaceId);
        if (!workspace)
            return res.status(404).json({ message: "Workspace not found" });
        const isMember = workspace.createdBy.toString() === req.user?.id ||
            workspace.members.some((m) => m.user.toString() === req.user?.id);
        if (!isMember) {
            return res.status(403).json({
                message: "Not authorized to delete comment in this workspace",
            });
        }
        // Step 4️⃣: Remove from card and delete comment
        await card_model_1.Card.findByIdAndUpdate(card._id, {
            $pull: { comments: comment._id },
        });
        await comment.deleteOne();
        // Step 5️⃣: Emit socket event
        const io = req.app.get("io");
        io.to(workspaceId).emit("commentDeleted", {
            workspaceId,
            commentId,
        });
        res.status(200).json({ message: "Comment deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting comment:", error);
        res.status(500).json({ message: "Server error", error });
    }
};
exports.DeleteComment = DeleteComment;
// ✅ Get all comments for a card
const GetCommentsByCard = async (req, res) => {
    try {
        const { cardId } = req.params;
        const comments = await comment_model_1.Comment.find({ card: cardId })
            .populate("createdBy", "username email") // Optional: show who wrote it
            .sort({ createdAt: -1 });
        res.status(200).json({ comments });
    }
    catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ message: "Server error", error });
    }
};
exports.GetCommentsByCard = GetCommentsByCard;
//# sourceMappingURL=comment.controller.js.map