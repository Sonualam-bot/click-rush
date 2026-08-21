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
      <main className="mx-auto max-w-2xl px-6 py-10 text-center">
        <h1 className="mb-6 text-2xl font-bold text-fg">Profile</h1>
        {loading && <p className="text-fg-muted">Loading...</p>}
        {error && <p className="text-red-400">{error}</p>}
        {!loading && !error && stats && (
          <>
            <StatsCards stats={stats} />
            <h2 className="mt-10 mb-4 text-lg font-semibold text-fg">
              History
            </h2>
            <HistoryTable items={history} />
          </>
        )}
      </main>
    </>
  );
}
