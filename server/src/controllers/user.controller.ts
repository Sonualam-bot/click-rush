import { Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { AuthedRequest } from "../middleware/requireAuth";
import { getHistory, getStats } from "../services/user.service";
import { historyQuerySchema } from "../validation/user.schema";
import { isValidMode } from "../config/modes";
import { InvalidModeError } from "../errors";

export const history = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const { mode, page, limit } = historyQuerySchema.parse(req.query);
  if (mode && !isValidMode(mode)) throw new InvalidModeError(mode);

  const result = await getHistory(req.userId!, mode, page, limit);
  res.json(result);
});

export const stats = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const result = await getStats(req.userId!);
  res.json(result);
});
