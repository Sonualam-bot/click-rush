import { Router } from "express";
import {
  signup,
  login,
  logout,
  me,
  guest,
} from "../controllers/auth.controller";
import { requireAuth } from "../middleware/requireAuth";
import { authRateLimiter } from "../middleware/rateLimit";

/**
 * Wiring only. signup/login/logout/guest skip requireAuth — they're what
 * create the session in the first place. /me needs it, since it reads
 * one. See controllers/auth.controller.ts. signup/login/guest are also
 * rate-limited (see middleware/rateLimit.ts) since they're the routes an
 * attacker could brute-force or spam; logout and /me don't need it.
 */
const router = Router();
router.post("/signup", authRateLimiter, signup);
router.post("/login", authRateLimiter, login);
router.post("/logout", logout);
router.post("/guest", authRateLimiter, guest);
router.get("/me", requireAuth, me);

export default router;
