import { api } from "./axiosClient";

export interface User {
  id: string;
  username: string;
  email: string;
}

export async function signup(
  username: string,
  email: string,
  password: string,
): Promise<User> {
  const { data } = await api.post<User>("/auth/signup", {
    username,
    email,
    password,
  });
  return data;
}

export async function login(email: string, password: string): Promise<User> {
  const { data } = await api.post<User>("/auth/login", {
    email,
    password,
  });
  return data;
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}

export async function guest(): Promise<User> {
  const { data } = await api.post<User>("/auth/guest");
  return data;
}

export async function me(): Promise<User> {
  const { data } = await api.get<User>("/auth/me");
  return data;
}
