import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { connectDB } from "../config/db";
import { User } from "../models/User.model";
import { GameSession } from "../models/GameSession.model";
import { GAME_MODES, type ModeId } from "../config/modes";

/**
 * Populates a clean demo dataset — deliberately WIPES all existing users
 * and game sessions first, so a demo video shows a predictable, curated
 * leaderboard/profile rather than a mix of real test accounts and fake
 * ones. Run explicitly (`npm run seed`), never automatically.
 */

dotenv.config();

const DEMO_USERNAMES = [
  "AceClicker",
  "SpeedyFingers",
  "ClickMaster",
  "RapidRon",
  "TapQueen",
  "FlashClick",
  "ButtonBasher",
  "QuickDraw",
];

const DEMO_PASSWORD = "password123";

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function seed() {
  await connectDB();

  console.log("Wiping existing users and game sessions...");
  await User.deleteMany({});
  await GameSession.deleteMany({});

  console.log("Creating demo users...");
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  const users = await User.insertMany(
    DEMO_USERNAMES.map((username) => ({
      username,
      email: `${username.toLowerCase()}@demo.local`,
      passwordHash,
    })),
  );

  console.log("Creating demo game sessions...");
  const modeIds = Object.keys(GAME_MODES) as ModeId[];
  const sessions = [];

  for (const user of users) {
    const gamesPlayed = randomInt(3, 7);
    for (let i = 0; i < gamesPlayed; i++) {
      // Non-null assertion: randomInt is always within [0, length-1] here,
      // an invariant noUncheckedIndexedAccess can't see from the types alone.
      const mode = modeIds[randomInt(0, modeIds.length - 1)]!;
      const duration = GAME_MODES[mode].duration;
      // Roughly 1-4 plausible clicks/sec, well under the 20/sec anti-cheat
      // ceiling, so seeded data never shows up flagged as suspicious.
      const clicks = randomInt(duration, duration * 4);

      // Spread across the last 10 days so global/daily/weekly views all
      // have something to show, not just global.
      const daysAgo = randomInt(0, 10);
      const submittedAt = new Date(
        Date.now() - daysAgo * 24 * 60 * 60 * 1000,
      );
      const startedAt = new Date(submittedAt.getTime() - duration * 1000);

      sessions.push({
        userId: user._id,
        mode,
        clicks,
        score: clicks,
        startedAt,
        submittedAt,
        status: "submitted" as const,
        isSuspicious: false,
      });
    }
  }

  await GameSession.insertMany(sessions);

  console.log(
    `Seeded ${users.length} users (password: "${DEMO_PASSWORD}") and ${sessions.length} game sessions.`,
  );

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
