import { Server, Socket } from "socket.io";
import { User } from "../models/user.model";
import { Workspace } from "../models/workspace.model";

interface ActiveUser {
  userId: string;
  workspaceId: string;
  socketId: string;
}

const activeUsers: ActiveUser[] = [];

export const registerUserSocketHandlers = (io: Server, socket: Socket) => {
  // ===============================
  // ✅ USER ONLINE EVENT
  // ===============================
  socket.on("userOnline", async ({ userId, workspaceId }) => {
    if (!userId || !workspaceId) return;

    // Check if workspace exists
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) return console.warn("Workspace not found for userOnline");

    // Add socket to workspace room
    socket.join(workspaceId);

    // Track active user
    const isAlreadyActive = activeUsers.some(
      (u) => u.userId === userId && u.workspaceId === workspaceId
    );
    if (!isAlreadyActive) {
      activeUsers.push({ userId, workspaceId, socketId: socket.id });
    }

    // Emit only to workspace room
    io.to(workspaceId).emit("userOnline", { userId, workspaceId });

    console.log(`🟢 User ${userId} is online in workspace ${workspaceId}`);
  });

  // ===============================
  // ✅ USER UPDATED EVENT
  // ===============================
  socket.on("userUpdated", async ({ userId, workspaceId, updatedFields }) => {
    if (!userId || !workspaceId) return;

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) return console.warn("Workspace not found for userUpdated");

    // Optionally update in DB
    if (updatedFields) {
      await User.findByIdAndUpdate(userId, updatedFields);
    }

    // Broadcast update to workspace room
    io.to(workspaceId).emit("userUpdated", {
      userId,
      workspaceId,
      updatedFields,
    });

    console.log(`🟡 User ${userId} updated in workspace ${workspaceId}`);
  });


  // ===============================
  // ✅ USER OFFLINE EVENT (on disconnect)
  // ===============================
  socket.on("disconnect", () => {
    const user = activeUsers.find((u) => u.socketId === socket.id);
    if (user) {
      activeUsers.splice(activeUsers.indexOf(user), 1);
      io.to(user.workspaceId).emit("userOffline", {
        userId: user.userId,
        workspaceId: user.workspaceId,
      });
      console.log(`🔴 User ${user.userId} went offline in workspace ${user.workspaceId}`);
    }
  });
};
