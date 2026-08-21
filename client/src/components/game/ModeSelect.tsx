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
                ? "border-violet-600 bg-violet-50 dark:bg-violet-950/40"
                : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
            }`}
          >
            <div className="font-semibold text-gray-900 dark:text-gray-100">
              {mode.label}
            </div>
          </button>
        ))}
      </div>
      <button
        onClick={onStart}
        className="rounded-lg bg-violet-600 px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-violet-700"
      >
        Start
      </button>
    </div>
  );
}
