import express from "express";
import {
  CreateActivity,
  GetActivities,
} from "../controllers/activity.controller";
import { authenticateUser } from "../middlewares/authenticateUser";

const router = express.Router();

router.post("/", authenticateUser, CreateActivity);
router.get("/", authenticateUser, GetActivities);

export default router;
