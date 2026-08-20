import { z } from "zod";

/**
 * Deliberately doesn't hardcode the list of valid modes here (that'd
 * duplicate config/modes.ts) — "is this a real mode" is checked in
 * services/score.service.ts against GAME_MODES, the single source of truth.
 */
export const startGameSchema = z.object({
  mode: z.string(),
});

export const submitGameSchema = z.object({
  sessionId: z.string(),
  clicks: z.number().int().min(0),
});
