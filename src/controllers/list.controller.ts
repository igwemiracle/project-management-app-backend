import { Board } from "../models/board.model";
import { List } from "../models/list.model";
import { Request, Response } from "express";

//✅ CREATE A NEW LIST
export const CreateList = async (req: Request, res: Response) => {
  try {
    const { title, boardId } = req.body;
    if (!title || !boardId) {
      return res.status(400).json({ message: "Title and Board ID are required" });
    }

    const newList = new List({
      title,
      board: boardId,
      cards: [],
      createdAt: new Date(),
    });
    await newList.save();

    // Push list reference into the board’s 'lists' array
    await Board.findByIdAndUpdate(boardId, { $push: { lists: newList._id } });

    res.status(201).json({ list: newList });
  } catch (error) {
    console.error("Error creating list:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ GET ALL LISTS FOR A BOARD
export const GetListsByBoard = async (req: Request, res: Response) => {
  try {
    // 
    const { boardId } = req.params;

    const lists = await List.find({ board: boardId })
      .populate("cards");

    res.status(200).json({ lists });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅  Update List
export const UpdateList = async (req: Request, res: Response) => {
  try {
    const { listId } = req.params;
    const { title } = req.body;

    const updatedList = await List.findByIdAndUpdate(
      listId,
      { title },
      { new: true }
    )
    if (!updatedList) return res.status(404).json({ message: "List not found" });

    res.status(200).json({ list: updatedList });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error })
  }
}


// ✅ Delete a list
export const DeleteList = async (req: Request, res: Response) => {
  try {
    const { listId } = req.params;

    const list = await List.findById(listId);
    if (!list) return res.status(404).json({ message: "List not found" });

    // Remove reference from board.lists array
    await Board.findByIdAndUpdate(list.board, { $pull: { lists: list._id } });

    await list.deleteOne();
    res.status(200).json({ message: "List deleted successfully" });
  } catch (error) {
    console.error("Error deleting list:", error);
    res.status(500).json({ message: "Server error", error });
  }
};