import axios from "axios";

/**
 * withCredentials lets the browser send/receive the server's httpOnly auth
 * cookie on cross-origin requests (client on :5173, server on :4000). No
 * token-attaching interceptor needed — the cookie rides along automatically.
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});
