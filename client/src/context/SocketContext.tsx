import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { io, type Socket } from "socket.io-client";

/**
 * One Socket.IO connection for the whole app, established once here and
 * read by useLeaderboard.ts via useSocket(). Connecting doesn't require
 * being logged in — viewing (and getting live updates for) a leaderboard
 * is public on the server side too (see leaderboard.controller.ts).
 */
const SocketContext = createContext<Socket | null>(null);

export function SocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const connection = io(import.meta.env.VITE_API_URL);
    setSocket(connection);

    return () => {
      connection.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}

export function useSocket(): Socket | null {
  return useContext(SocketContext);
}
