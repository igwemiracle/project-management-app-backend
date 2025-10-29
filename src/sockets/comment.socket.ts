import { Server, Socket } from "socket.io";

export default function registerCommentSocketHandlers(io: Server, socket: Socket) {
  socket.on("joinWorkspace", (workspaceId: string) => {
    socket.join(workspaceId);
    console.log(`👤 User ${socket.id} joined workspace ${workspaceId}`);
  });

  socket.on("commentCreated", (data) => {
    io.to(data.workspaceId).emit("commentCreated", data);
    console.log(`🆕 Comment created in workspace ${data.workspaceId}`);
  });

  socket.on("commentUpdated", (data) => {
    io.to(data.workspaceId).emit("commentUpdated", data);
    console.log(`✏️ Comment updated in workspace ${data.workspaceId}`);
  });

  socket.on("commentDeleted", (data) => {
    io.to(data.workspaceId).emit("commentDeleted", data);
    console.log(`🗑️ Comment deleted in workspace ${data.workspaceId}`);
  });
}