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
      <main style={{ padding: "2rem", textAlign: "center" }}>
        <h1>Leaderboard</h1>
        <LeaderboardTabs active={period} onChange={setPeriod} />
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        {!loading && !error && <LeaderboardTable entries={entries} />}
      </main>
    </>
  );
}
