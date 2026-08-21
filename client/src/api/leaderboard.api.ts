import { api } from "./axiosClient";

export type LeaderboardPeriod = "global" | "daily" | "weekly";

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  bestScore: number;
  achievedAt: string;
}

export interface LeaderboardResponse {
  period: LeaderboardPeriod;
  mode: string;
  entries: LeaderboardEntry[];
  page: number;
  limit: number;
}

export async function fetchLeaderboard(
  period: LeaderboardPeriod,
  mode = "classic60",
): Promise<LeaderboardResponse> {
  const { data } = await api.get<LeaderboardResponse>(
    `/leaderboard/${period}`,
    { params: { mode } },
  );
  return data;
}
