import { useEffect, useState } from "react";
import { Navbar } from "../components/layout/Navbar";
import { StatsCards } from "../components/profile/StatsCards";
import { HistoryTable } from "../components/profile/HistoryTable";
import {
  fetchHistory,
  fetchStats,
  type HistoryItem,
  type StatsResponse,
} from "../api/user.api";

export function ProfilePage() {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([fetchStats(), fetchHistory()])
      .then(([statsRes, historyRes]) => {
        setStats(statsRes);
        setHistory(historyRes.items);
      })
      .catch(() => setError("Could not load profile"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <main style={{ padding: "2rem", textAlign: "center" }}>
        <h1>Profile</h1>
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        {!loading && !error && stats && (
          <>
            <StatsCards stats={stats} />
            <h2>History</h2>
            <HistoryTable items={history} />
          </>
        )}
      </main>
    </>
  );
}
