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
  blitz30: { duration: 30, label: "Blitz — 30 seconds" },
  endurance120: { duration: 120, label: "Endurance — 120 seconds" },
} as const satisfies Record<string, GameModeConfig>;

export type ModeId = keyof typeof GAME_MODES;

export function isValidMode(mode: string): mode is ModeId {
  // hasOwnProperty, not the `in` operator — `in` also matches inherited
  // properties like "toString"/"constructor", which would resolve to an
  // Object.prototype function instead of a GameModeConfig and silently
  // break every duration-based check downstream (NaN comparisons are
  // always false, so anti-cheat checks would stop rejecting anything).
  return Object.prototype.hasOwnProperty.call(GAME_MODES, mode);
}

// Explicit, not derived from Object.keys(GAME_MODES)[0] — insertion order
// happens to be spec-guaranteed for string keys, but "the default mode is
// whatever's declared first" is a fragile, easy-to-silently-break implicit
// contract. Say it outright instead.
export const DEFAULT_MODE: ModeId = "classic60";
