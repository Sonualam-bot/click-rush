import { Link } from "react-router-dom";
import { Navbar } from "../components/layout/Navbar";
import { useAuth } from "../context/AuthContext";

export function HomePage() {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <main className="flex flex-col items-center gap-6 px-6 py-20 text-center">
        <h1 className="text-3xl font-bold text-fg">
          Welcome, {user?.username}
        </h1>
        <p className="max-w-md text-fg-muted">
          Click as many times as you can before the clock runs out, then see
          where you land on the leaderboard.
        </p>
        <Link
          to="/game"
          className="rounded-lg bg-primary px-6 py-3 font-semibold text-background transition-colors hover:bg-primary-strong"
        >
          Play now
        </Link>
      </main>
    </>
  );
}
