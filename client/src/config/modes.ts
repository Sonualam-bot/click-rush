/**
 * Display-only mirror of the server's config/modes.ts — used to render
 * the mode picker and drive the client's own countdown/timer display.
 * Not a security boundary: the server independently looks up each mode's
 * real duration when checking a submit's timing, so nothing here needs to
 * be trusted, only kept in sync by hand when a mode is added or changed.
 */
export interface GameModeConfig {
  id: string;
  duration: number;
  label: string;
}

export const GAME_MODES: GameModeConfig[] = [
  { id: "classic60", duration: 60, label: "Classic — 60 seconds" },
  { id: "blitz30", duration: 30, label: "Blitz — 30 seconds" },
  { id: "endurance120", duration: 120, label: "Endurance — 120 seconds" },
];

export function getModeDuration(modeId: string): number {
  return (
    GAME_MODES.find((m) => m.id === modeId)?.duration ?? GAME_MODES[0].duration
  );
}
