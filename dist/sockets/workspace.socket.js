"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = registerWorkspaceSocketHandlers;
// export default function registerWorkspaceSocketHandlers(io: Server, socket: Socket) {
//   // Workspace created
//   socket.on("workspaceCreated", (workspace) => {
//     io.emit("workspaceCreated", workspace);
//     console.log(`🆕 Workspace created: ${workspace.name}`);
//   });
//   // Workspace updated
//   socket.on("workspaceUpdated", (workspace) => {
//     io.emit("workspaceUpdated", workspace);
//     console.log(`✏️ Workspace updated: ${workspace._id}`);
//   });
//   // Member added
//   socket.on("memberAdded", (data) => {
//     io.emit("memberAdded", data);
//     console.log(`👥 Member added: ${data.userId} to workspace ${data.workspaceId}`);
//   });
//   // Member removed
//   socket.on("memberRemoved", (data) => {
//     io.emit("memberRemoved", data);
//     console.log(`🚫 Member removed: ${data.userId} from workspace ${data.workspaceId}`);
//   });
//   // Role updated
//   socket.on("roleUpdated", (data) => {
//     io.emit("roleUpdated", data);
//     console.log(`🔑 Role updated for ${data.userId} in workspace ${data.workspaceId}`);
//   });
// }
/**
 *
 * ----------------------------------------------------------------------------------------------------------------------------------------------
 *
*/
function registerWorkspaceSocketHandlers(io, socket) {
    // 🧩 JOIN a workspace room
    socket.on("joinWorkspace", (workspaceId) => {
        socket.join(workspaceId);
        console.log(`👤 User ${socket.id} joined workspace ${workspaceId}`);
    });
    // 🚪 LEAVE a workspace room
    socket.on("leaveWorkspace", (workspaceId) => {
        socket.leave(workspaceId);
        console.log(`👋 User ${socket.id} left workspace ${workspaceId}`);
    });
    // 🆕 Workspace created
    socket.on("workspaceCreated", (workspace) => {
        if (workspace.isPrivate) {
            // Notify only members in that workspace (private/personal)
            io.to(workspace._id.toString()).emit("workspaceCreated", workspace);
        }
        else {
            // Public workspace → notify everyone
            io.emit("workspaceCreated", workspace);
        }
        console.log(`🆕 Workspace created: ${workspace.name}`);
    });
    // ✏️ Workspace updated
    socket.on("workspaceUpdated", (workspace) => {
        // Notify only members of that workspace
        io.to(workspace._id.toString()).emit("workspaceUpdated", workspace);
        console.log(`✏️ Workspace updated: ${workspace._id}`);
    });
    // 🗑️ Workspace deleted
    socket.on("workspaceDeleted", (data) => {
        const { workspaceId } = data;
        io.to(workspaceId).emit("workspaceDeleted", { workspaceId });
        console.log(`🗑️ Workspace deleted: ${workspaceId}`);
    });
    // 👥 Member added
    socket.on("memberAdded", (data) => {
        const { workspaceId } = data;
        io.to(workspaceId).emit("memberAdded", data);
        console.log(`👥 Member added to workspace ${workspaceId}`);
    });
    // 🚫 Member removed
    socket.on("memberRemoved", (data) => {
        const { workspaceId } = data;
        io.to(workspaceId).emit("memberRemoved", data);
        console.log(`🚫 Member removed from workspace ${workspaceId}`);
    });
    // 🔑 Role updated
    socket.on("roleUpdated", (data) => {
        const { workspaceId } = data;
        io.to(workspaceId).emit("roleUpdated", data);
        console.log(`🔑 Role updated in workspace ${workspaceId}`);
    });
}
//# sourceMappingURL=workspace.socket.js.map