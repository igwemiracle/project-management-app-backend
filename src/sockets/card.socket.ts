import { Server, Socket } from "socket.io";

export default function registerCardSocketHandlers(io: Server, socket: Socket) {
  socket.on("joinWorkspace", (workspaceId: string) => {
    socket.join(workspaceId);
    console.log(`👤 User ${socket.id} joined workspace ${workspaceId}`);
  });

  socket.on("cardCreated", (data) => {
    io.to(data.workspaceId).emit("cardCreated", data);
    console.log(`🆕 Card created in workspace ${data.workspaceId}`);
  });

  socket.on("cardUpdated", (data) => {
    io.to(data.workspaceId).emit("cardUpdated", data);
    console.log(`✏️ Card updated in workspace ${data.workspaceId}`);
  });

  socket.on("cardDeleted", (data) => {
    io.to(data.workspaceId).emit("cardDeleted", data);
    console.log(`🗑️ Card deleted in workspace ${data.workspaceId}`);
  });
}
