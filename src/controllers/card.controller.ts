import { Request, Response } from "express";
import { Card } from "../models/card.model";
import { List } from "../models/list.model";
import { logActivity } from "../utils/logActivity";


// ✅ Create a new card
export const CreateCard = async (req: Request, res: Response) => {
  try {
    const { title, description, listId } = req.body;

    if (!title || !listId) {
      return res.status(400).json({ message: "Title and listId are required" });
    }

    const list = await List.findById(listId);
    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }

    const boardId = list.board.toString();

    const newCard = new Card({
      title,
      description,
      list: listId,
      createdBy: req.user?.id,
    });

    await newCard.save();

    // Add reference to the list
    await List.findByIdAndUpdate(listId, { $push: { cards: newCard._id } });

    // ✅ Log activity
    await logActivity({
      userId: req.user!.id,
      boardId,
      entityType: "Card",
      entityName: title,
      actionType: "create",
      details: `Created Card: "${title}"`,
    });

    res.status(201).json({ card: newCard });
  } catch (error) {
    console.error("Error creating card:", error);
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

    if (!updatedCard)
      return res.status(404).json({ message: "Card not found" });

    const list = await List.findById(updatedCard.list);
    const boardId = list?.board.toString() ?? "";

    // ✅ Log activity
    await logActivity({
      userId: req.user!.id,
      boardId,
      entityType: "Card",
      entityName: updatedCard.title,
      actionType: "update",
      details: `Updated Card: "${updatedCard.title}"`,
    });

    res.status(200).json({ card: updatedCard });
  } catch (error) {
    console.error("Error updating card:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Delete a card
// ✅ Delete a card
export const DeleteCard = async (req: Request, res: Response) => {
  try {
    const { cardId } = req.params;

    const card = await Card.findById(cardId);
    if (!card) return res.status(404).json({ message: "Card not found" });

    const list = await List.findById(card.list);
    const boardId = list?.board ? list.board.toString() : null;

    // Remove card reference from the list
    await List.findByIdAndUpdate(card.list, { $pull: { cards: card._id } });

    await card.deleteOne();

    // ✅ Only log if we have a valid boardId
    if (boardId) {
      await logActivity({
        userId: req.user!.id,
        boardId,
        entityType: "Card",
        entityName: card.title,
        actionType: "delete",
      });
    } else {
      console.warn("⚠️ Skipping activity log: boardId not found for deleted card");
    }

    res.status(200).json({ message: "Card deleted successfully" });
  } catch (error) {
    console.error("Error deleting card:", error);
    res.status(500).json({ message: "Server error", error });
  }
};



// ✅ Get all cards in a list
export const GetCardsByList = async (req: Request, res: Response) => {
  try {
    const { listId } = req.params;
    const cards = await Card.find({ list: listId }).populate("comments");
    res.status(200).json({ cards });
  } catch (error) {
    console.error("Error fetching cards:", error);
    res.status(500).json({ message: "Server error", error });
  }
};