import type { StatsResponse } from "../../api/user.api";

interface StatsCardsProps {
  stats: StatsResponse;
}

export function StatsCards({ stats }: StatsCardsProps) {
  if (stats.byMode.length === 0) {
    return (
      <p className="text-gray-500 dark:text-gray-400">
        No games played yet — go set a score!
      </p>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {stats.byMode.map((m) => (
        <div
          key={m.mode}
          className="min-w-[160px] rounded-xl border border-gray-200 dark:border-gray-800 p-5 text-left"
        >
          <h3 className="text-sm font-semibold text-violet-600 dark:text-violet-400">
            {m.mode}
          </h3>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
            {m.bestScore}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            best score
          </p>
          <div className="mt-3 flex justify-between text-sm text-gray-600 dark:text-gray-300">
            <span>Rank #{m.rank}</span>
            <span>{m.gamesPlayed} games</span>
          </div>
        </div>
      ))}
    </div>
  );
}
