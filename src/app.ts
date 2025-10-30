import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import boardRoutes from "./routes/board.routes";
import listRoutes from "./routes/list.routes";
import cardRoutes from "./routes/card.routes"
import commentRoutes from "./routes/comment.routes";
import workspaceRoutes from "./routes/workspace.routes";
import activityRoutes from "./routes/activity.routes";
import accountRoutes from "./routes/account.routes";

connectDB();

const app = express();


const allowedOrigins = [
  "http://localhost:5173",
  "https://project-management-4pf8jgd20-igwe-miracles-projects.vercel.app",
  "https://project-management-7d86ayln8-igwe-miracles-projects.vercel.app"
];




app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`CORS blocked: ${origin}`);
      callback(new Error("Not allowed by CORS"), false);
    }
  },
  credentials: true,
}));


app.use(express.json());
app.use(cookieParser());


/* Routers */
app.use("/api/auth", authRoutes);
app.use("/api/account", accountRoutes);
app.use("/api/users", userRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/lists", listRoutes);
app.use("/api/cards", cardRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/workspaces", workspaceRoutes)
app.use("/api/activity-logs", activityRoutes);

export default app;