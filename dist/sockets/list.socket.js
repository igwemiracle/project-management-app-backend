"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = registerListSocketHandlers;
function registerListSocketHandlers(io, socket) {
    socket.on("joinWorkspace", (workspaceId) => {
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
//# sourceMappingURL=list.socket.js.map