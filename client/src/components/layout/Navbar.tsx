import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const linkClass =
  "text-sm font-medium text-fg-muted hover:text-fg transition-colors";

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 px-4 sm:px-6 py-4 border-b border-line">
      <Link to="/" className="text-lg font-bold text-primary">
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
          <span className="ml-auto text-sm text-fg-muted">
            Hi, {user.username}
          </span>
          <button
            onClick={() => logout()}
            className="rounded-md border border-line px-3 py-1.5 text-sm font-medium hover:bg-surface transition-colors"
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
