import { Types } from "mongoose";
import { GameSession } from "../models/GameSession.model";

export interface HistoryItem {
  id: string;
  mode: string;
  clicks: number;
  score: number;
  submittedAt: Date;
  isSuspicious: boolean;
}

export interface HistoryResult {
  items: HistoryItem[];
  page: number;
  limit: number;
  total: number;
}

/**
 * Paginated past games for one user — same shape of problem as
 * leaderboard.service.ts, but scoped by userId instead of grouped across
 * everyone. Uses the {userId:1, submittedAt:-1} index. .find()/.sort()
 * here (not .aggregate()) get Mongoose's automatic string->ObjectId query
 * casting for free — see getStats() below for why that matters.
 */
export async function getHistory(
  userId: string,
  mode: string | undefined,
  page: number,
  limit: number,
): Promise<HistoryResult> {
  const filter: Record<string, unknown> = { userId, status: "submitted" };
  if (mode) filter.mode = mode;

  const skip = (page - 1) * limit;

  const [docs, total] = await Promise.all([
    GameSession.find(filter)
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    GameSession.countDocuments(filter),
  ]);

  const items: HistoryItem[] = docs.map((doc) => ({
    id: String(doc._id),
    mode: doc.mode,
    clicks: doc.clicks,
    score: doc.score,
    submittedAt: doc.submittedAt!,
    isSuspicious: doc.isSuspicious,
  }));

  return { items, page, limit, total };
}

export interface ModeStats {
  mode: string;
  bestScore: number;
  gamesPlayed: number;
  rank: number;
}

export interface StatsResult {
  byMode: ModeStats[];
  totalGamesPlayed: number;
}

/**
 * Best score, games played, and rank per mode the user has actually
 * played (a mode with zero games has no meaningful "best score" or
 * "rank" to show). Easy to forget: computing rank means asking "how many
 * OTHER distinct players have a best score above mine" — not "how many
 * of my games", and not "how many game records" (a player who played
 * ten mediocre games shouldn't out-rank someone who played once and
 * scored higher, and shouldn't count ten times either).
 */
export async function getStats(userId: string): Promise<StatsResult> {
  // .aggregate() does NOT get Mongoose's automatic query casting the way
  // .find() does — $match is sent to MongoDB as-is, so userId has to be
  // cast to ObjectId by hand or this silently matches nothing.
  const userObjectId = new Types.ObjectId(userId);

  const byModeAgg = await GameSession.aggregate([
    { $match: { userId: userObjectId, status: "submitted" } },
    {
      $group: {
        _id: "$mode",
        bestScore: { $max: "$score" },
        gamesPlayed: { $sum: 1 },
      },
    },
  ]);

  const byMode: ModeStats[] = [];
  for (const row of byModeAgg) {
    const mode = row._id as string;
    const bestScore = row.bestScore as number;

    const betterPlayers = await GameSession.aggregate([
      { $match: { mode, status: "submitted" } },
      { $group: { _id: "$userId", bestScore: { $max: "$score" } } },
      { $match: { bestScore: { $gt: bestScore } } },
      { $count: "count" },
    ]);
    const rank = (betterPlayers[0]?.count ?? 0) + 1;

    byMode.push({ mode, bestScore, gamesPlayed: row.gamesPlayed, rank });
  }

  const totalGamesPlayed = byMode.reduce((sum, m) => sum + m.gamesPlayed, 0);

  return { byMode, totalGamesPlayed };
}
