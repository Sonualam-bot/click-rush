import { Router } from "express";
import { start, submit } from "../controllers/game.controller";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();
router.post("/start", requireAuth, start);
router.post("/submit", requireAuth, submit);

export default router;
