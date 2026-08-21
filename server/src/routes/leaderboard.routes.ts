import { Router } from "express";
import { list } from "../controllers/leaderboard.controller";

const router = Router();
router.get("/:period", list);

export default router;
