import { Server } from "socket.io";
import registerWorkspaceSocketHandlers from "./workspace.socket";
import registerBoardSocketHandlers from "./board.socket";

export default function registerSocketHandlers(io: Server) {
  console.log("🧩 Socket.IO initialized and listening for connections...");

  io.on("connection", (socket) => {
    console.log(`⚡ User connected: ${socket.id}`);

    registerWorkspaceSocketHandlers(io, socket);
    registerBoardSocketHandlers(io, socket);

    socket.on("disconnect", () => {
      console.log(`❌ User disconnected: ${socket.id}`);
    });
  });
}
