import { z } from "zod";

export const leaderboardParamsSchema = z.object({
  period: z.enum(["global", "daily", "weekly"]),
});

// Query params always arrive as strings — z.coerce.number() parses "2" -> 2.
export const leaderboardQuerySchema = z.object({
  mode: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
