import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import boardRoutes from "./routes/board.routes";
import listRoutes from "./routes/list.routes";


dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());


/* Routers */
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/board", boardRoutes);
app.use("/api/lists", listRoutes);


export default app;