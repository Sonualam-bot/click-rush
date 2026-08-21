import type { StatsResponse } from "../../api/user.api";

interface StatsCardsProps {
  stats: StatsResponse;
}

export function StatsCards({ stats }: StatsCardsProps) {
  if (stats.byMode.length === 0) {
    return (
      <p className="text-fg-muted">No games played yet — go set a score!</p>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {stats.byMode.map((m) => (
        <div
          key={m.mode}
          className="min-w-[160px] rounded-xl border border-line bg-surface p-5 text-left"
        >
          <h3 className="text-sm font-semibold text-primary">{m.mode}</h3>
          <p className="mt-2 text-2xl font-bold text-fg">{m.bestScore}</p>
          <p className="text-xs text-fg-muted">best score</p>
          <div className="mt-3 flex justify-between text-sm text-fg-muted">
            <span>Rank #{m.rank}</span>
            <span>{m.gamesPlayed} games</span>
          </div>
        </div>
      ))}
    </div>
  );
}
