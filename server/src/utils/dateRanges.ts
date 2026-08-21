/**
 * Deliberately UTC-based, not per-user-timezone — a documented
 * simplification (see README). "Today" and "this week" mean the same
 * thing for every player regardless of where they are; the tradeoff is a
 * player near a UTC day boundary might see their game land in what feels
 * like the "wrong" day locally.
 */
export interface DateRange {
  start: Date;
  end: Date;
}

/** [UTC midnight today, UTC midnight tomorrow) */
export function getDailyRange(now = new Date()): DateRange {
  const start = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);
  return { start, end };
}

/** ISO week: [Monday 00:00 UTC, next Monday 00:00 UTC) */
export function getWeeklyRange(now = new Date()): DateRange {
  const dayOfWeek = now.getUTCDay(); // Sun=0, Mon=1, ..., Sat=6
  const daysSinceMonday = (dayOfWeek + 6) % 7; // Mon=0, Tue=1, ..., Sun=6

  const start = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() - daysSinceMonday,
    ),
  );
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 7);
  return { start, end };
}
