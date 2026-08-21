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
              ? "bg-primary text-background"
              : "text-fg-muted hover:bg-surface"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
