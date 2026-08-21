import type { LeaderboardEntry } from "../../api/leaderboard.api";

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
}

const MEDALS: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };

export function LeaderboardTable({ entries }: LeaderboardTableProps) {
  if (entries.length === 0) {
    return (
      <p className="mt-8 text-gray-500 dark:text-gray-400">
        No scores yet — be the first to play!
      </p>
    );
  }

  return (
    <div className="mt-6 overflow-x-auto">
      <table className="mx-auto w-full max-w-md border-collapse text-left">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-800 text-sm text-gray-500 dark:text-gray-400">
            <th className="px-3 py-2 font-medium">Rank</th>
            <th className="px-3 py-2 font-medium">Player</th>
            <th className="px-3 py-2 font-medium text-right">Score</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr
              key={entry.userId}
              className="border-b border-gray-100 dark:border-gray-900"
            >
              <td className="px-3 py-2 font-medium text-gray-700 dark:text-gray-300">
                {MEDALS[entry.rank] ?? `#${entry.rank}`}
              </td>
              <td className="px-3 py-2 text-gray-900 dark:text-gray-100">
                {entry.username}
              </td>
              <td className="px-3 py-2 text-right font-mono text-gray-900 dark:text-gray-100">
                {entry.bestScore}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
