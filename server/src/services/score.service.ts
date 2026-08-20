import { GameSession } from "../models/GameSession.model";
import { GAME_MODES, type ModeId } from "../config/modes";
import {
  InvalidModeError,
  GameSessionNotFoundError,
  GameSessionAlreadySubmittedError,
  SubmittedTooEarlyError,
} from "../errors";

/**
 * Anti-cheat core. The server —> not the browser <— decides when a game
 * started and how long it's allowed to run; see submitSession() for the
 * elapsed-time and click-rate checks that make the score trustworthy.
 * Called from controllers/game.controller.ts.
 */

const GRACE_MS = 2000;
const MAX_CLICKS_PER_SECOND = 20;

function isValidMode(mode: string): mode is ModeId {
  return mode in GAME_MODES;
}

export async function startSession(userId: string, mode: string) {
  if (!isValidMode(mode)) throw new InvalidModeError(mode);

  return GameSession.create({
    userId,
    mode,
    startedAt: new Date(),
    status: "active",
  });
}

export async function submitSession(
  userId: string,
  sessionId: string,
  clicks: number,
) {
  // Scoped by userId, not just _id — a session that exists but belongs to
  // someone else looks identical to a nonexistent one from the caller's
  // side, so this can't be used to probe for other users' session ids.
  const session = await GameSession.findOne({ _id: sessionId, userId });
  if (!session) throw new GameSessionNotFoundError();

  if (session.status !== "active") {
    throw new GameSessionAlreadySubmittedError();
  }

  const modeConfig = GAME_MODES[session.mode as ModeId];
  const durationMs = modeConfig.duration * 1000;
  const elapsedMs = Date.now() - session.startedAt.getTime();

  // Impossible to submit a real result before the clock the server itself
  // is keeping says time is up — reject outright rather than flag.
  if (elapsedMs < durationMs - GRACE_MS) {
    throw new SubmittedTooEarlyError();
  }

  // Everything past this point is plausible-but-suspicious, not
  // impossible, so it's flagged and stored rather than rejected: a very
  // late submit could be a backgrounded tab, and a high click rate could
  // be a fast clicker, not necessarily a bot. Losing a legitimate score to
  // a false-positive reject is worse than just flagging it for review.
  const maxPlausibleClicks = modeConfig.duration * MAX_CLICKS_PER_SECOND;
  const isSuspicious =
    elapsedMs > durationMs + GRACE_MS * 3 || clicks > maxPlausibleClicks;

  session.clicks = clicks;
  session.score = clicks;
  session.submittedAt = new Date();
  session.status = "submitted";
  session.isSuspicious = isSuspicious;
  await session.save();

  return {
    score: session.score,
    clicks: session.clicks,
    clicksPerSecond: Number((clicks / modeConfig.duration).toFixed(2)),
    isSuspicious,
  };
}
