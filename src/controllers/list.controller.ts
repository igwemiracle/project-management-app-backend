import { Board } from "../models/board.model";
import { List } from "../models/list.model";
import { Request, Response } from "express";
import { logActivity } from "../utils/logActivity";

//✅ CREATE A NEW LIST
export const CreateList = async (req: Request, res: Response) => {
  try {
    const { title, boardId } = req.body;
    const io = req.app.get("io");

    if (!title || !boardId) {
      return res.status(400).json({ message: "Title and Board ID are required" });
    }

    // Step 1: Find the board
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    // Step 2: Create new list
    const newList = new List({
      title,
      board: boardId,
      cards: [],
      createdAt: new Date(),
    });
    await newList.save();

    // ✅ Emit to all members in that workspace
    io.to(board.workspace.toString()).emit("listCreated", newList);

    // Step 3: Add to board’s lists
    await Board.findByIdAndUpdate(boardId, { $push: { lists: newList._id } });

    // Step 4: Log the action with correct workspace
    await logActivity({
      userId: req.user!.id,
      workspaceId: board.workspace.toString(), // ✅ Correct workspace reference
      entityType: "List",
      entityName: title,
      actionType: "create",
      details: `Created List: "${title}"`,
    });

    res.status(201).json({ list: newList });
  } catch (error) {
    console.error("Error creating list:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ UPDATE ALL LISTS FOR A BOARD
export const UpdateList = async (req: Request, res: Response) => {
  try {
    const { listId } = req.params;
    console.log("Updating List ID:", listId);
    const { title } = req.body;
    const io = req.app.get("io");

    // Step 1: Find the list
    const list = await List.findById(listId);
    if (!list) return res.status(404).json({ message: "List not found" });

    // Step 2: Find the board it belongs to
    const board = await Board.findById(list.board);
    if (!board) return res.status(404).json({ message: "Parent board not found" });

    // Step 3: Update the list
    list.title = title || list.title;
    await list.save();

    // Step 4: Log the activity correctly
    await logActivity({
      userId: req.user!.id,
      workspaceId: board.workspace.toString(), // ✅ Correct workspace reference
      entityType: "List",
      entityName: list.title,
      actionType: "update",
      details: `Updated List: "${list.title}"`,
    });

    // Step 5: Emit to all members in that workspace
    io.to(board.workspace.toString()).emit("listUpdated", list);

    res.status(200).json({ list });
  } catch (error) {
    console.error("Error updating list:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Delete a list
export const DeleteList = async (req: Request, res: Response) => {
  try {
    const { listId } = req.params;
    const io = req.app.get("io");

    // Step 1: Find the list
    const list = await List.findById(listId);
    if (!list) return res.status(404).json({ message: "List not found" });

    // Step 2: Find the board it belongs to
    const board = await Board.findById(list.board);
    if (!board) return res.status(404).json({ message: "Parent board not found" });

    // Step 3: Remove list reference from the board’s 'lists' array
    await Board.findByIdAndUpdate(list.board, { $pull: { lists: list._id } });

    // Step 4: Delete the list
    await list.deleteOne();

    // Step 5: Log activity (with correct workspace)
    await logActivity({
      userId: req.user!.id,
      workspaceId: board.workspace.toString(), // ✅ Correct workspace reference
      entityType: "List",
      entityName: list.title,
      actionType: "delete",
      details: `Deleted List: "${list.title}"`,
    });


    // ✅ Emit deletion event
    io.to(board.workspace.toString()).emit("listDeleted", {
      listId,
      boardId: board._id,
    });

    res.status(200).json({ message: "List deleted successfully" });
  } catch (error) {
    console.error("Error deleting list:", error);
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

    // Verify board exists for authorization
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    // Ensure lists belong to the logged in user's board
    if (board.createdBy.toString() !== req.user?.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.status(200).json({ lists });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};