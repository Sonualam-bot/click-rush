import rateLimit from "express-rate-limit";

/**
 * Caps signup/login/guest attempts per IP — without this, /auth/login is a
 * free brute-force target and /auth/signup+/auth/guest are free to spam.
 * Applied only to the auth routes that create sessions/accounts (see
 * routes/auth.routes.ts); /me is a read and doesn't need it.
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many attempts, please try again later" },
});
