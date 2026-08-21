import { Link } from "react-router-dom";
import { Navbar } from "../components/layout/Navbar";
import { useAuth } from "../context/AuthContext";

export function HomePage() {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <main className="flex flex-col items-center gap-6 px-6 py-20 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Welcome, {user?.username}
        </h1>
        <p className="max-w-md text-gray-500 dark:text-gray-400">
          Click as many times as you can before the clock runs out, then see
          where you land on the leaderboard.
        </p>
        <Link
          to="/game"
          className="rounded-lg bg-violet-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-violet-700"
        >
          Play now
        </Link>
      </main>
    </>
  );
}
