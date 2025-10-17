import { Server, Socket } from "socket.io";

export default function registerBoardSocketHandlers(io: Server, socket: Socket) {
  socket.on("boardCreated", (board) => {
    io.emit("boardCreated", board);
    console.log(`🆕 Board created: ${board.name}`);
  });

  socket.on("boardUpdated", (board) => {
    io.emit("boardUpdated", board);
    console.log(`✏️ Board updated: ${board._id}`);
  });

  socket.on("boardDeleted", (boardId) => {
    io.emit("boardDeleted", boardId);
    console.log(`🗑️ Board deleted: ${boardId}`);
  });
}
