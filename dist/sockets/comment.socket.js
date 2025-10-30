"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = registerCommentSocketHandlers;
function registerCommentSocketHandlers(io, socket) {
    socket.on("joinWorkspace", (workspaceId) => {
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
//# sourceMappingURL=comment.socket.js.map