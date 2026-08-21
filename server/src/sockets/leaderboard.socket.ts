import type { Server, Socket } from "socket.io";

/**
 * Per-mode rooms ("leaderboard:classic60", etc.), not a single global
 * broadcast — a client watching one mode's leaderboard shouldn't be woken
 * up by submits in a mode it isn't looking at. Room membership is driven
 * entirely by the client (see client/src/hooks/useLeaderboard.ts); the
 * emit side lives in controllers/game.controller.ts, right after a
 * successful submit. No per-period ("daily"/"weekly") rooms — which time
 * window is being viewed is a client-side tab, not something the server
 * needs to track a subscription for.
 */
export function registerLeaderboardHandlers(io: Server) {
  io.on("connection", (socket: Socket) => {
    socket.on("leaderboard:join", ({ mode }: { mode: string }) => {
      socket.join(`leaderboard:${mode}`);
    });

    socket.on("leaderboard:leave", ({ mode }: { mode: string }) => {
      socket.leave(`leaderboard:${mode}`);
    });
  });
}
