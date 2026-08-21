import type { LeaderboardEntry } from "../../api/leaderboard.api";

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
}

const MEDALS: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };

export function LeaderboardTable({ entries }: LeaderboardTableProps) {
  if (entries.length === 0) {
    return (
      <p className="mt-8 text-fg-muted">No scores yet — be the first to play!</p>
    );
  }

  return (
    <div className="mt-6 overflow-x-auto">
      <table className="mx-auto w-full max-w-md border-collapse text-left">
        <thead>
          <tr className="border-b border-line text-sm text-fg-muted">
            <th className="px-3 py-2 font-medium">Rank</th>
            <th className="px-3 py-2 font-medium">Player</th>
            <th className="px-3 py-2 font-medium text-right">Score</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.userId} className="border-b border-line/50">
              <td className="px-3 py-2 font-medium text-fg-muted">
                {MEDALS[entry.rank] ?? `#${entry.rank}`}
              </td>
              <td className="px-3 py-2 text-fg">{entry.username}</td>
              <td className="px-3 py-2 text-right font-mono text-primary">
                {entry.bestScore}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
