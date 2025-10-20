import { Server, Socket } from "socket.io";

export default function registerListSocketHandlers(io: Server, socket: Socket) {
  socket.on("joinWorkspace", (workspaceId: string) => {
    socket.join(workspaceId);
    console.log(`👤 User ${socket.id} joined workspace ${workspaceId} (List context)`);
  });

  socket.on("listCreated", (list) => {
    io.to(list.workspaceId.toString()).emit("listCreated", list);
  });

  socket.on("listUpdated", (list) => {
    io.to(list.workspaceId.toString()).emit("listUpdated", list);
  });

  socket.on("listDeleted", (data) => {
    io.to(data.workspaceId.toString()).emit("listDeleted", data);
  });
}
