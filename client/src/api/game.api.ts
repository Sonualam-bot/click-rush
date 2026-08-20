import { api } from "./axiosClient";

export interface StartGameResponse {
  sessionId: string;
  mode: string;
  durationSeconds: number;
  startedAt: string;
}

export interface SubmitGameResponse {
  score: number;
  clicks: number;
  clicksPerSecond: number;
  isSuspicious: boolean;
}

export async function startGame(mode: string): Promise<StartGameResponse> {
  const { data } = await api.post<StartGameResponse>("/game/start", { mode });
  return data;
}

export async function submitGame(
  sessionId: string,
  clicks: number,
): Promise<SubmitGameResponse> {
  const { data } = await api.post<SubmitGameResponse>("/game/submit", {
    sessionId,
    clicks,
  });
  return data;
}
