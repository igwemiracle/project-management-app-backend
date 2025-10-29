import { Server } from "socket.io";
import registerWorkspaceSocketHandlers from "./workspace.socket";
import registerBoardSocketHandlers from "./board.socket";
import registerListSocketHandlers from "./list.socket";
import registerCardSocketHandlers from "./card.socket";
import registerCommentSocketHandlers from "./comment.socket";
import { registerUserSocketHandlers } from "./user.socket";



export default function registerSocketHandlers(io: Server) {
  console.log("🧩 Socket.IO initialized and listening for connections...");

  io.on("connection", (socket) => {
    console.log(`⚡ User connected: ${socket.id}`);

    registerUserSocketHandlers(io, socket);
    registerWorkspaceSocketHandlers(io, socket);
    registerBoardSocketHandlers(io, socket);
    registerListSocketHandlers(io, socket);
    registerCardSocketHandlers(io, socket);
    registerCommentSocketHandlers(io, socket);

    socket.on("disconnect", () => {
      console.log(`❌ User disconnected: ${socket.id}`);
    });
  });
}
