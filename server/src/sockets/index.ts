import type { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { registerLeaderboardHandlers } from "./leaderboard.socket";

/**
 * Single Socket.IO instance for the whole process, created once at
 * startup alongside the Express app (see index.ts) and sharing the same
 * underlying HTTP server/port. getIO() is how any other module — namely
 * controllers/game.controller.ts, on a successful submit — reaches it
 * without threading an `io` parameter through every function call in
 * between. Same fail-fast shape as config/db.ts's connectDB(): calling
 * getIO() before initSocket() has run is a programmer error, not a
 * recoverable one, so it throws rather than returning something nullable.
 */
let io: SocketIOServer | undefined;

export function initSocket(httpServer: HttpServer): SocketIOServer {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.CLIENT_ORIGIN,
      credentials: true,
    },
  });

  registerLeaderboardHandlers(io);

  return io;
}

export function getIO(): SocketIOServer {
  if (!io) {
    throw new Error("Socket.IO not initialized — call initSocket() first");
  }
  return io;
}
