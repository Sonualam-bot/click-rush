import { Response } from "express";
import { startGameSchema, submitGameSchema } from "../validation/game.schema";
import { startSession, submitSession } from "../services/score.service";
import { asyncHandler } from "../utils/asyncHandler";
import { AuthedRequest } from "../middleware/requireAuth";
import { GAME_MODES, type ModeId } from "../config/modes";
import { getIO } from "../sockets";

/**
 * Thin HTTP layer for the game session lifecycle — parse/validate, call
 * services/score.service.ts, shape the response. Routed from
 * routes/game.routes.ts (mounted at /game). Both endpoints require auth —
 * a game session always belongs to whoever's playing it.
 */

export const start = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const { mode } = startGameSchema.parse(req.body);
  const session = await startSession(req.userId!, mode);

  res.status(201).json({
    sessionId: session.id,
    mode: session.mode,
    durationSeconds: GAME_MODES[session.mode as ModeId].duration,
    startedAt: session.startedAt,
  });
});

export const submit = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const { sessionId, clicks } = submitGameSchema.parse(req.body);
  const { mode, ...responseBody } = await submitSession(
    req.userId!,
    sessionId,
    clicks,
  );

  // The client's leaderboard view reacts by refetching (see
  // client/src/hooks/useLeaderboard.ts), not by reading fields off this
  // event — so the payload only needs to say *which* leaderboard changed,
  // not carry score/username details nobody downstream will use.
  getIO().to(`leaderboard:${mode}`).emit("leaderboard:update", { mode });

  res.json(responseBody);
});
