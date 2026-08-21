import type { LeaderboardEntry } from "../../api/leaderboard.api";

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
}

export function LeaderboardTable({ entries }: LeaderboardTableProps) {
  if (entries.length === 0) {
    return <p>No scores yet — be the first to play!</p>;
  }

  return (
    <table style={{ margin: "1rem auto", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th style={{ padding: "0.5rem" }}>Rank</th>
          <th style={{ padding: "0.5rem" }}>Player</th>
          <th style={{ padding: "0.5rem" }}>Score</th>
        </tr>
      </thead>
      <tbody>
        {entries.map((entry) => (
          <tr key={entry.userId}>
            <td style={{ padding: "0.5rem", textAlign: "center" }}>
              {entry.rank}
            </td>
            <td style={{ padding: "0.5rem" }}>{entry.username}</td>
            <td style={{ padding: "0.5rem", textAlign: "center" }}>
              {entry.bestScore}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
