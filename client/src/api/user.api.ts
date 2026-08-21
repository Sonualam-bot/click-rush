import { api } from "./axiosClient";

export interface HistoryItem {
  id: string;
  mode: string;
  clicks: number;
  score: number;
  submittedAt: string;
  isSuspicious: boolean;
}

export interface HistoryResponse {
  items: HistoryItem[];
  page: number;
  limit: number;
  total: number;
}

export interface ModeStats {
  mode: string;
  bestScore: number;
  gamesPlayed: number;
  rank: number;
}

export interface StatsResponse {
  byMode: ModeStats[];
  totalGamesPlayed: number;
}

export async function fetchHistory(
  page = 1,
  limit = 20,
): Promise<HistoryResponse> {
  const { data } = await api.get<HistoryResponse>("/user/history", {
    params: { page, limit },
  });
  return data;
}

export async function fetchStats(): Promise<StatsResponse> {
  const { data } = await api.get<StatsResponse>("/user/stats");
  return data;
}
