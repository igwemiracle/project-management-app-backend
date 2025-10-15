import { Request, Response } from "express";
import { Comment } from "../models/comment.model";
import { Card } from "../models/card.model";

// ✅ Create a comment
export const CreateComment = async (req: Request, res: Response) => {
  try {
    const { text, cardId } = req.body;

    if (!text || !cardId) {
      return res.status(400).json({ message: "Text and cardId are required" });
    }
    const newComment = new Comment({
      text,
      card: cardId,
      createdBy: req.user?.id,
    });

    await newComment.save();

    // Optionally, you could store comment refs in Card schema if you plan to populate them
    await Card.findByIdAndUpdate(cardId, { $push: { comments: newComment._id } });

    res.status(201).json({ comment: newComment });
  } catch (error) {
    console.error("Error creating comment:", error);
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

// ✅ Update a comment
export const UpdateComment = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;

    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { text },
      { new: true }
    );

    if (!updatedComment)
      return res.status(404).json({ message: "Comment not found" });

    res.status(200).json({ comment: updatedComment });
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Delete a comment
export const DeleteComment = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // Optional: remove from card’s comments array
    await Card.findByIdAndUpdate(comment.card, { $pull: { comments: comment._id } });

    await comment.deleteOne();
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
