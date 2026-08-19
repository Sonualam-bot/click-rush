import { useEffect, useState } from "react";
import { api } from "./api/axiosClient";

/**
 * Stage 0 placeholder: proves the client can reach the server (CORS +
 * credentials working) before any real feature is built on top. Gets
 * replaced by real routing/pages in Stage 2.
 */
function App() {
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");

  useEffect(() => {
    api
      .get("/health")
      .then(() => setStatus("ok"))
      .catch(() => setStatus("error"));
  }, []);

  return (
    <main style={{ fontFamily: "sans-serif", padding: "2rem" }}>
      <h1>ClickRush</h1>
      <p>API status: {status}</p>
    </main>
  );
}

export default App;
