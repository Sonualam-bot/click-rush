import type { LeaderboardPeriod } from "../../api/leaderboard.api";

interface LeaderboardTabsProps {
  active: LeaderboardPeriod;
  onChange: (period: LeaderboardPeriod) => void;
}

const TABS: { id: LeaderboardPeriod; label: string }[] = [
  { id: "global", label: "Global" },
  { id: "daily", label: "Daily" },
  { id: "weekly", label: "Weekly" },
];

export function LeaderboardTabs({ active, onChange }: LeaderboardTabsProps) {
  return (
    <div className="flex justify-center gap-2">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            active === tab.id
              ? "bg-violet-600 text-white"
              : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
