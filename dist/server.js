"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const app_1 = __importDefault(require("./app"));
const sockets_1 = __importDefault(require("./sockets"));
const PORT = process.env.PORT || 5000;
// 1️⃣ Create a raw HTTP server using your Express app
const server = http_1.default.createServer(app_1.default);
// 2️⃣ Initialize Socket.IO server and attach to HTTP server
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*", // For development; later, restrict to your frontend domain
        methods: ["GET", "POST"],
    },
});
exports.io = io;
// 3️⃣ Register all socket event handlers (User, Workspace, etc.)
(0, sockets_1.default)(io);
app_1.default.set("io", io);
// 4️⃣ Start listening with the HTTP + WebSocket server
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
//# sourceMappingURL=server.js.map