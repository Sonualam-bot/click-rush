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
        <p>This is a placeholder the game itself gets built later</p>
      </main>
    </>
  );
}
