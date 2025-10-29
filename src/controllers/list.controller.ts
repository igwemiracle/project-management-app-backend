import { Board } from "../models/board.model";
import { List } from "../models/list.model";
import { Request, Response } from "express";
import { logActivity } from "../utils/logActivity";

//✅ CREATE A NEW LIST
export const CreateList = async (req: Request, res: Response) => {
  try {
    const { title, boardId, color } = req.body;
    const io = req.app.get("io");

    if (!title || !boardId) {
      return res.status(400).json({ message: "Title and Board ID are required" });
    }

    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    // ✅ Determine position: one more than the number of existing lists
    const existingLists = await List.find({ board: boardId });
    const position = existingLists.length;

    const newList = new List({
      title,
      board: boardId,
      cards: [],
      color: color || null,
      position, // ✅ Assign position
      createdAt: new Date(),
    });

    await newList.save();

    await Board.findByIdAndUpdate(boardId, { $push: { lists: newList._id } });

    io.to(board.workspace.toString()).emit("listCreated", newList);

    await logActivity({
      userId: req.user!.id,
      workspaceId: board.workspace.toString(),
      entityType: "List",
      entityName: title,
      actionType: "create",
      details: `Created List: "${title}" at position ${position}`,
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

// ✅ UPDATE ALL LIST COLOR
export const UpdateListColor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, position, color } = req.body;

    const list = await List.findById(id);
    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }

    if (title !== undefined) list.title = title;
    if (position !== undefined) list.position = position;
    if (color !== undefined) list.color = color;

    await list.save();

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

export const GetAllLists = async (req: Request, res: Response) => {
  try {
    const lists = await List.find({ owner: req.user?.id },)

    res.status(200).json({ lists });
  } catch (error) {
    console.error("Error fetching lists:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const GetListsByBoard = async (req: Request, res: Response) => {
  try {
    const boardId = (req.query.board || req.query.boardId) as string;

    if (!boardId) {
      return res.status(400).json({ message: "Board ID is required" });
    }

    const lists = await List.find({ board: boardId })
      .populate("cards")
      .sort({ position: 1 }); // ✅ Order by position ascending

    res.status(200).json({ lists });
  } catch (error) {
    console.error("Error fetching lists:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const ReorderLists = async (req: Request, res: Response) => {
  try {
    const { boardId, orderedListIds } = req.body; // e.g. ["list1", "list2", "list3"]

    if (!boardId || !orderedListIds || !Array.isArray(orderedListIds)) {
      return res.status(400).json({ message: "boardId and orderedListIds are required" });
    }

    const updates = orderedListIds.map((id, index) =>
      List.findByIdAndUpdate(id, { position: index })
    );

    await Promise.all(updates);

    res.status(200).json({ message: "Lists reordered successfully" });
  } catch (error) {
    console.error("Error reordering lists:", error);
    res.status(500).json({ message: "Server error", error });
  }
};