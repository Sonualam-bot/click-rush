import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { getLeaderboard } from "../services/leaderboard.service";
import {
  leaderboardParamsSchema,
  leaderboardQuerySchema,
} from "../validation/leaderboard.schema";
import { DEFAULT_MODE, isValidMode } from "../config/modes";
import { InvalidModeError } from "../errors";

/**
 * Public — no requireAuth. Anyone (logged in or not) can view a
 * leaderboard; only submitting a score requires auth.
 */
export const list = asyncHandler(async (req: Request, res: Response) => {
  const { period } = leaderboardParamsSchema.parse(req.params);
  const { mode, page, limit } = leaderboardQuerySchema.parse(req.query);

  const resolvedMode = mode ?? DEFAULT_MODE;
  if (!isValidMode(resolvedMode)) throw new InvalidModeError(resolvedMode);

  const result = await getLeaderboard(period, resolvedMode, page, limit);
  res.json({ period, mode: resolvedMode, ...result });
});
