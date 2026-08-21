import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const linkClass =
  "text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors";

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-800">
      <Link
        to="/"
        className="text-lg font-bold text-violet-600 dark:text-violet-400"
      >
        ClickRush
      </Link>
      {user ? (
        <>
          <Link to="/game" className={linkClass}>
            Play
          </Link>
          <Link to="/leaderboard" className={linkClass}>
            Leaderboard
          </Link>
          <Link to="/profile" className={linkClass}>
            Profile
          </Link>
          <span className="ml-auto text-sm text-gray-500 dark:text-gray-400">
            Hi, {user.username}
          </span>
          <button
            onClick={() => logout()}
            className="rounded-md border border-gray-300 dark:border-gray-700 px-3 py-1.5 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Log out
          </button>
        </>
      ) : (
        <div className="ml-auto flex gap-4">
          <Link to="/login" className={linkClass}>
            Login
          </Link>
          <Link to="/signup" className={linkClass}>
            Signup
          </Link>
        </div>
      )}
    </nav>
  );
}
