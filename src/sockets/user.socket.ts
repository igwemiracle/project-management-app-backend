import { Server, Socket } from "socket.io";

export default function registerUserSocketHandlers(io: Server, socket: Socket) {
  // When user comes online
  socket.on("userOnline", (userId: string) => {
    io.emit("userOnline", { userId });
    console.log(`✅ User ${userId} is online`);
  });

  // When user goes offline
  socket.on("userOffline", (userId: string) => {
    io.emit("userOffline", { userId });
    console.log(`⚪ User ${userId} is offline`);
  });

  // When user updates profile
  socket.on("userUpdated", (data: any) => {
    io.emit("userUpdated", data);
    console.log(`🔄 User updated: ${JSON.stringify(data)}`);
  });
}
