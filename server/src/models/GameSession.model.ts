import mongoose, {
  Schema,
  Document as MongooseDocument,
  Types,
} from "mongoose";

/**
 * A single played game. Created (status: "active") by POST /game/start with
 * a server-side startedAt, then closed out (status: "submitted") by
 * POST /game/submit — see services/score.service.ts for the timing/rate
 * checks that happen at that transition. clicks/score are 0 until submit.
 */
export interface IGameSession extends MongooseDocument {
  userId: Types.ObjectId;
  mode: string;
  clicks: number;
  score: number;
  startedAt: Date;
  submittedAt?: Date;
  status: "active" | "submitted";
  isSuspicious: boolean;
}

const gameSessionSchema = new Schema<IGameSession>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  mode: {
    type: String,
    required: true,
  },
  clicks: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  score: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  startedAt: {
    type: Date,
    required: true,
  },
  submittedAt: {
    type: Date,
  },
  status: {
    type: String,
    enum: ["active", "submitted"],
    default: "active",
  },
  isSuspicious: {
    type: Boolean,
    default: false,
  },
});

// Profile history: "this user's games, newest first".
gameSessionSchema.index({ userId: 1, submittedAt: -1 });
// Leaderboards: "top scores for this mode, optionally within a date range" —
// the compound index covers global (mode-only), daily, and weekly queries
// via prefix matching, built in Stage 5.
gameSessionSchema.index({ mode: 1, submittedAt: 1, score: -1 });

export const GameSession = mongoose.model<IGameSession>(
  "GameSession",
  gameSessionSchema,
);
