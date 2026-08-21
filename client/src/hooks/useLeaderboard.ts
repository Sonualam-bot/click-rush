import { useCallback, useEffect, useState } from "react";
import {
  fetchLeaderboard,
  type LeaderboardEntry,
  type LeaderboardPeriod,
} from "../api/leaderboard.api";

export function useLeaderboard(period: LeaderboardPeriod, mode = "classic60") {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchLeaderboard(period, mode)
      .then((res) => setEntries(res.entries))
      .catch(() => setError("Could not load leaderboard"))
      .finally(() => setLoading(false));
  }, [period, mode]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { entries, loading, error, refetch };
}
