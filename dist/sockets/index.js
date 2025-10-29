"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = registerSocketHandlers;
const workspace_socket_1 = __importDefault(require("./workspace.socket"));
const board_socket_1 = __importDefault(require("./board.socket"));
const list_socket_1 = __importDefault(require("./list.socket"));
const card_socket_1 = __importDefault(require("./card.socket"));
const comment_socket_1 = __importDefault(require("./comment.socket"));
const user_socket_1 = require("./user.socket");
function registerSocketHandlers(io) {
    console.log("🧩 Socket.IO initialized and listening for connections...");
    io.on("connection", (socket) => {
        console.log(`⚡ User connected: ${socket.id}`);
        (0, user_socket_1.registerUserSocketHandlers)(io, socket);
        (0, workspace_socket_1.default)(io, socket);
        (0, board_socket_1.default)(io, socket);
        (0, list_socket_1.default)(io, socket);
        (0, card_socket_1.default)(io, socket);
        (0, comment_socket_1.default)(io, socket);
        socket.on("disconnect", () => {
            console.log(`❌ User disconnected: ${socket.id}`);
        });
    });
}
//# sourceMappingURL=index.js.map