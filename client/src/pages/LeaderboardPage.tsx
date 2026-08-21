import { useState } from "react";
import { Navbar } from "../components/layout/Navbar";
import { LeaderboardTabs } from "../components/leaderboard/LeaderboardTabs";
import { LeaderboardTable } from "../components/leaderboard/LeaderboardTable";
import { useLeaderboard } from "../hooks/useLeaderboard";
import type { LeaderboardPeriod } from "../api/leaderboard.api";

export function LeaderboardPage() {
  const [period, setPeriod] = useState<LeaderboardPeriod>("global");
  const { entries, loading, error } = useLeaderboard(period);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-2xl px-6 py-10 text-center">
        <h1 className="mb-6 text-2xl font-bold text-fg">Leaderboard</h1>
        <LeaderboardTabs active={period} onChange={setPeriod} />
        {loading && <p className="mt-8 text-fg-muted">Loading...</p>}
        {error && <p className="mt-8 text-red-400">{error}</p>}
        {!loading && !error && <LeaderboardTable entries={entries} />}
      </main>
    </>
  );
}
