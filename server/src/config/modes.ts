/**
 * Single source of truth for game modes — duration drives both the
 * anti-cheat timing check in services/score.service.ts and (mirrored on
 * the client) the countdown/timer UI. Adding a mode later is one entry
 * here, not logic scattered across multiple files.
 */
export interface GameModeConfig {
  duration: number; // seconds
  label: string;
}

export const GAME_MODES = {
  classic60: { duration: 60, label: "Classic — 60 seconds" },
} as const satisfies Record<string, GameModeConfig>;

export type ModeId = keyof typeof GAME_MODES;
