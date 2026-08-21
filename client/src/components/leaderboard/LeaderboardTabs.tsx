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
    <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          style={{ fontWeight: active === tab.id ? "bold" : "normal" }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
