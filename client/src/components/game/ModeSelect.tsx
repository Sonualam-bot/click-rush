import { GAME_MODES } from "../../config/modes";

interface ModeSelectProps {
  selectedMode: string;
  onSelectMode: (mode: string) => void;
  onStart: () => void;
}

export function ModeSelect({
  selectedMode,
  onSelectMode,
  onStart,
}: ModeSelectProps) {
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex flex-wrap justify-center gap-3">
        {GAME_MODES.map((mode) => (
          <button
            key={mode.id}
            onClick={() => onSelectMode(mode.id)}
            className={`rounded-xl border px-5 py-4 text-left transition-colors ${
              selectedMode === mode.id
                ? "border-primary bg-primary/10"
                : "border-line hover:border-fg-muted"
            }`}
          >
            <div className="font-semibold text-fg">{mode.label}</div>
          </button>
        ))}
      </div>
      <button
        onClick={onStart}
        className="rounded-lg bg-primary px-8 py-3 text-lg font-semibold text-background transition-colors hover:bg-primary-strong"
      >
        Start
      </button>
    </div>
  );
}
