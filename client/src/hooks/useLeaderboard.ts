import { useCallback, useEffect, useRef, useState } from "react";
import {
  fetchLeaderboard,
  type LeaderboardEntry,
  type LeaderboardPeriod,
} from "../api/leaderboard.api";
import { useSocket } from "../context/SocketContext";

const DEBOUNCE_MS = 500;

export function useLeaderboard(period: LeaderboardPeriod, mode = "classic60") {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const socket = useSocket();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  // Room membership only depends on `mode`, not `period` — rooms are
  // per-mode on the server (see leaderboard.socket.ts); which time window
  // is on screen is purely a client-side tab. Deliberately its own effect,
  // separate from the listener below: if this depended on `refetch` too,
  // every period-tab switch (which changes `refetch`'s identity, since it
  // closes over `period`) would also churn a leave+rejoin of the exact
  // same room for no reason.
  useEffect(() => {
    if (!socket) return;

    socket.emit("leaderboard:join", { mode });
    return () => {
      socket.emit("leaderboard:leave", { mode });
    };
  }, [socket, mode]);

  // The listener, on the other hand, *does* need to be resubscribed
  // whenever `refetch` changes — otherwise it would keep calling a stale
  // closure that still fetches the previously-selected period forever.
  useEffect(() => {
    if (!socket) return;

    function handleUpdate(payload: { mode: string }) {
      if (payload.mode !== mode) return;
      // Trailing debounce: if several submits land in a burst, only
      // refetch once, 500ms after the last one — not once per event.
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(refetch, DEBOUNCE_MS);
    }

    socket.on("leaderboard:update", handleUpdate);
    return () => {
      socket.off("leaderboard:update", handleUpdate);
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [socket, mode, refetch]);

  return { entries, loading, error, refetch };
}
