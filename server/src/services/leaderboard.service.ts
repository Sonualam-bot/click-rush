import { GameSession } from "../models/GameSession.model";
import { getDailyRange, getWeeklyRange } from "../utils/dateRanges";
import type { ModeId } from "../config/modes";

export type LeaderboardPeriod = "global" | "daily" | "weekly";

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  bestScore: number;
  achievedAt: Date;
}

export interface LeaderboardResult {
  entries: LeaderboardEntry[];
  page: number;
  limit: number;
}

/**
 * One aggregation pipeline for all three periods — global just omits the
 * date filter. Deliberately not a separate denormalized "best score"
 * collection: at this scale one query path is simpler and sufficient;
 * noted in the README as a future scale optimization if it's ever needed.
 */
export async function getLeaderboard(
  period: LeaderboardPeriod,
  mode: ModeId,
  page: number,
  limit: number,
): Promise<LeaderboardResult> {
  const range =
    period === "daily"
      ? getDailyRange()
      : period === "weekly"
        ? getWeeklyRange()
        : null;

  const skip = (page - 1) * limit;

  const match: Record<string, unknown> = { mode, status: "submitted" };
  if (range) {
    match.submittedAt = { $gte: range.start, $lt: range.end };
  }

  const results = await GameSession.aggregate([
    // mode is the prefix of the {mode:1, submittedAt:1, score:-1} index,
    // so this $match is index-covered whether or not the date range
    // (also on that index) is present.
    { $match: match },
    // Collapse to one row per player — the leaderboard shows each
    // player's best game, not every game they've played.
    {
      $group: {
        _id: "$userId",
        bestScore: { $max: "$score" },
        achievedAt: { $max: "$submittedAt" },
      },
    },
    { $sort: { bestScore: -1 } },
    { $skip: skip },
    { $limit: limit },
    // Only after narrowing to one page's worth of rows do we join to
    // users — cheap regardless of how many total GameSession docs exist.
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $project: {
        _id: 0,
        userId: "$_id",
        username: "$user.username",
        bestScore: 1,
        achievedAt: 1,
      },
    },
  ]);

  const entries: LeaderboardEntry[] = results.map((r, i) => ({
    rank: skip + i + 1,
    userId: String(r.userId),
    username: r.username,
    bestScore: r.bestScore,
    achievedAt: r.achievedAt,
  }));

  return { entries, page, limit };
}
