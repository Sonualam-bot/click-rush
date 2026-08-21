import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        borderBottom: "1px solid #ddd",
      }}
    >
      <Link to="/">ClickRush</Link>
      {user ? (
        <>
          <Link to="/game">Play</Link>
          <Link to="/leaderboard">Leaderboard</Link>
          <Link to="/profile">Profile</Link>
          <span>Hi, {user.username}</span>
          <button onClick={() => logout()}>Log out</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/signup">Signup</Link>
        </>
      )}
    </nav>
  );
}
