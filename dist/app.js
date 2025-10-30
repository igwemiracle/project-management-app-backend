"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const db_1 = __importDefault(require("./config/db"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const board_routes_1 = __importDefault(require("./routes/board.routes"));
const list_routes_1 = __importDefault(require("./routes/list.routes"));
const card_routes_1 = __importDefault(require("./routes/card.routes"));
const comment_routes_1 = __importDefault(require("./routes/comment.routes"));
const workspace_routes_1 = __importDefault(require("./routes/workspace.routes"));
const activity_routes_1 = __importDefault(require("./routes/activity.routes"));
const account_routes_1 = __importDefault(require("./routes/account.routes"));
(0, db_1.default)();
const app = (0, express_1.default)();
const allowedOrigins = [
    "http://localhost:5173",
    "https://project-management-4pf8jgd20-igwe-miracles-projects.vercel.app"
];
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            console.log(`CORS blocked: ${origin}`);
            callback(new Error("Not allowed by CORS"), false);
        }
    },
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
/* Routers */
app.use("/api/auth", auth_routes_1.default);
app.use("/api/account", account_routes_1.default);
app.use("/api/users", user_routes_1.default);
app.use("/api/boards", board_routes_1.default);
app.use("/api/lists", list_routes_1.default);
app.use("/api/cards", card_routes_1.default);
app.use("/api/comments", comment_routes_1.default);
app.use("/api/workspaces", workspace_routes_1.default);
app.use("/api/activity-logs", activity_routes_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map