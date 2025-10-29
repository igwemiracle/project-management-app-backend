import { Request, Response } from "express";
import { Comment } from "../models/comment.model";
import { Card } from "../models/card.model";
import { Workspace } from "../models/workspace.model";
import { List } from "../models/list.model";

// ✅ Create a comment
export const CreateComment = async (req: Request, res: Response) => {
  try {
    const { text, cardId } = req.body;

    if (!text || !cardId) {
      return res.status(400).json({ message: "Text and cardId are required" });
    }

    const card = await Card.findById(cardId);
    if (!card) return res.status(404).json({ message: "Card not found" });

    const list = await List.findById(card.list).populate({
      path: "board",
      select: "workspace",
    });
    if (!list) return res.status(404).json({ message: "List not found" });

    const workspaceId = (list.board as any).workspace.toString();

    if (!card) return res.status(404).json({ message: "Card not found" });

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) return res.status(404).json({ message: "Workspace not found" });

    const isMember =
      workspace.createdBy.toString() === req.user?.id ||
      workspace.members.some((m) => m.user.toString() === req.user?.id);
    if (!isMember) {
      return res.status(403).json({ message: "Not authorized to comment in this workspace" });
    }

    const newComment = new Comment({
      text,
      card: cardId,
      createdBy: req.user?.id,
    });

    await newComment.save();
    await Card.findByIdAndUpdate(cardId, { $push: { comments: newComment._id } });

    // Emit to workspace members
    const io = req.app.get("io");
    io.to(workspaceId.toString()).emit("commentCreated", {
      workspaceId: workspaceId.toString(),
      comment: newComment,
    });

    res.status(201).json({ comment: newComment });
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Update a comment
export const UpdateComment = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;

    // Step 1️⃣: Find the comment
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // Step 2️⃣: Get the card and list to trace the workspace
    const card = await Card.findById(comment.card);
    if (!card) return res.status(404).json({ message: "Card not found" });

    const list = await List.findById(card.list).populate({
      path: "board",
      select: "workspace createdBy members",
    });
    if (!list) return res.status(404).json({ message: "List not found" });
    if (!list.board) return res.status(404).json({ message: "Board not found" });

    const workspaceId = (list.board as any).workspace.toString();

    // Step 3️⃣: Verify workspace membership
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace)
      return res.status(404).json({ message: "Workspace not found" });

    const isMember =
      workspace.createdBy.toString() === req.user?.id ||
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
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Delete a comment
export const DeleteComment = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;

    // Step 1️⃣: Find the comment
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // Step 2️⃣: Get card and list to trace workspace
    const card = await Card.findById(comment.card);
    if (!card) return res.status(404).json({ message: "Card not found" });

    const list = await List.findById(card.list).populate({
      path: "board",
      select: "workspace createdBy members",
    });
    if (!list) return res.status(404).json({ message: "List not found" });
    if (!list.board) return res.status(404).json({ message: "Board not found" });

    const workspaceId = (list.board as any).workspace.toString();

    // Step 3️⃣: Check membership
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace)
      return res.status(404).json({ message: "Workspace not found" });

    const isMember =
      workspace.createdBy.toString() === req.user?.id ||
      workspace.members.some((m) => m.user.toString() === req.user?.id);
    if (!isMember) {
      return res.status(403).json({
        message: "Not authorized to delete comment in this workspace",
      });
    }

    // Step 4️⃣: Remove from card and delete comment
    await Card.findByIdAndUpdate(card._id, {
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
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


// ✅ Get all comments for a card
export const GetCommentsByCard = async (req: Request, res: Response) => {
  try {
    const { cardId } = req.params;

    const comments = await Comment.find({ card: cardId })
      .populate("createdBy", "username email") // Optional: show who wrote it
      .sort({ createdAt: -1 });

    res.status(200).json({ comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
