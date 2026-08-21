import { GAME_MODES } from "../../config/modes";

interface LeaderboardModeSelectProps {
  active: string;
  onChange: (mode: string) => void;
}

export function LeaderboardModeSelect({
  active,
  onChange,
}: LeaderboardModeSelectProps) {
  return (
    <div className="flex justify-center gap-2">
      {GAME_MODES.map((mode) => (
        <button
          key={mode.id}
          onClick={() => onChange(mode.id)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            active === mode.id
              ? "bg-primary text-background"
              : "text-fg-muted hover:bg-surface"
          }`}
        >
          {mode.shortLabel}
        </button>
      ))}
    </div>
  );
}
