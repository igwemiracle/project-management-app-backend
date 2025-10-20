import { Request, Response } from "express";
import { Card } from "../models/card.model";
import { List } from "../models/list.model";
import { logActivity } from "../utils/logActivity";
import { io } from "../server";
import { Workspace } from "../models/workspace.model";
import { Board } from "../models/board.model";


// ✅ Create a new card
export const CreateCard = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description = "",
      listId,
      position = 0,
      assignedTo = [],
      labels = [],
      attachments = [],
      dueDate = null
    } = req.body;

    if (!title || !listId) {
      return res.status(400).json({ message: "Title and listId are required" });
    }

    const list = await List.findById(listId);
    if (!list) return res.status(404).json({ message: "List not found" });

    const board = await Board.findById(list.board);
    if (!board) return res.status(404).json({ message: "Board not found" });

    const workspace = await Workspace.findById(board.workspace);
    if (!workspace) return res.status(404).json({ message: "Workspace not found" });

    const newCard = new Card({
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
    await List.findByIdAndUpdate(listId, { $push: { cards: newCard._id } });

    // Log activity
    await logActivity({
      userId: req.user!.id,
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
        ...newCard.toObject(),   // convert Mongoose doc to plain JS object
        _id: newCard._id.toString(),
        list: newCard.list.toString(),
        board: newCard.board.toString(),
        createdBy: newCard.createdBy.toString()
      }
    });
  } catch (error) {
    console.error("❌ Error creating card:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


// ✅ Update a card
export const UpdateCard = async (req: Request, res: Response) => {
  try {
    const { cardId } = req.params;
    const { title, description } = req.body;

    const updatedCard = await Card.findByIdAndUpdate(
      cardId,
      { title, description },
      { new: true }
    );

    if (!updatedCard) {
      return res.status(404).json({ message: "Card not found" });
    }

    const list = await List.findById(updatedCard.list);
    if (!list) return res.status(404).json({ message: "List not found" });

    const board = await Board.findById(list.board);
    if (!board) return res.status(404).json({ message: "Board not found" });

    const workspace = await Workspace.findById(board.workspace);
    if (!workspace) return res.status(404).json({ message: "Workspace not found" });

    // ✅ Log activity
    await logActivity({
      userId: req.user!.id,
      workspaceId: board.workspace.toString(),
      boardId: board._id.toString(),
      entityType: "Card",
      entityName: updatedCard.title,
      actionType: "update",
      details: `Updated Card: "${updatedCard.title}"`,
    });

    // ✅ Emit to only workspace members
    io.to(workspace._id.toString()).emit("cardUpdated", updatedCard);

    res.status(200).json({ card: updatedCard });
  } catch (error) {
    console.error("❌ Error updating card:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Delete a card
export const DeleteCard = async (req: Request, res: Response) => {
  try {
    const { cardId } = req.params;

    const card = await Card.findById(cardId);
    if (!card) return res.status(404).json({ message: "Card not found" });

    const list = await List.findById(card.list);
    if (!list) return res.status(404).json({ message: "List not found" });

    const board = await Board.findById(list.board);
    if (!board) return res.status(404).json({ message: "Board not found" });

    const workspace = await Workspace.findById(board.workspace);
    if (!workspace) return res.status(404).json({ message: "Workspace not found" });

    // Remove card reference from list
    await List.findByIdAndUpdate(card.list, { $pull: { cards: card._id } });

    await card.deleteOne();

    // ✅ Log activity
    await logActivity({
      userId: req.user!.id,
      workspaceId: board.workspace.toString(),
      boardId: board._id.toString(),
      entityType: "Card",
      entityName: card.title,
      actionType: "delete",
      details: `Deleted Card: "${card.title}"`,
    });

    // ✅ Emit to only workspace members
    io.to(workspace._id.toString()).emit("cardDeleted", {
      cardId: card._id,
      listId: list._id,
    });

    res.status(200).json({ message: "Card deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting card:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Get Cards by boards
export const GetCardsByBoard = async (req: Request, res: Response) => {
  try {
    const boardId = req.query.board as string;

    if (!boardId) {
      return res.status(400).json({ message: "Board ID is required" });
    }

    const cards = await Card.find({ board: boardId });

    res.status(200).json({ cards });
  } catch (error) {
    console.error("Error fetching cards:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

