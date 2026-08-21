import type { StatsResponse } from "../../api/user.api";

interface StatsCardsProps {
  stats: StatsResponse;
}

export function StatsCards({ stats }: StatsCardsProps) {
  if (stats.byMode.length === 0) {
    return <p>No games played yet — go set a score!</p>;
  }

  return (
    <div
      style={{
        display: "flex",
        gap: "1rem",
        justifyContent: "center",
        flexWrap: "wrap",
      }}
    >
      {stats.byMode.map((m) => (
        <div
          key={m.mode}
          style={{ border: "1px solid #ddd", padding: "1rem", minWidth: 150 }}
        >
          <h3>{m.mode}</h3>
          <p>Best: {m.bestScore}</p>
          <p>Rank: #{m.rank}</p>
          <p>Games played: {m.gamesPlayed}</p>
        </div>
      ))}
    </div>
  );
}
