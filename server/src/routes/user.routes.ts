import { Router } from "express";
import { history, stats } from "../controllers/user.controller";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();
router.get("/history", requireAuth, history);
router.get("/stats", requireAuth, stats);

export default router;
