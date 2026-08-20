import { Link } from "react-router-dom";
import { Navbar } from "../components/layout/Navbar";
import { useAuth } from "../context/AuthContext";

export function HomePage() {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <main
        style={{
          padding: "2rem",
        }}
      >
        <h1>Welcome, {user?.username} </h1>
        <Link to="/game">Play</Link>
      </main>
    </>
  );
}
