import { Server, Socket } from "socket.io";

export default function registerBoardSocketHandlers(io: Server, socket: Socket) {
  // When a board is created
  socket.on("boardCreated", (data) => {
    const { workspaceId, board } = data;
    io.to(workspaceId).emit("boardCreated", { board });
    console.log(`📋 Board created in workspace ${workspaceId}:`, board);
  });

  // When a board is updated
  socket.on("boardUpdated", (data) => {
    const { workspaceId, board } = data;
    io.to(workspaceId).emit("boardUpdated", { board });
    console.log(`✏️ Board updated in workspace ${workspaceId}:`, board);
  });

  // When a board is deleted
  socket.on("boardDeleted", (data) => {
    const { workspaceId, boardId } = data;
    io.to(workspaceId).emit("boardDeleted", { boardId });
    console.log(`🗑️ Board deleted in workspace ${workspaceId}:`, boardId);
  });
}
