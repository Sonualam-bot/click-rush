import { useState } from "react";
import type { SyntheticEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;

function validate(username: string, password: string): string | null {
  if (username.length < 3 || username.length > 20) {
    return "Username must be 3-20 characters";
  }
  if (!USERNAME_REGEX.test(username)) {
    return "Username can only contain letters, numbers, and underscores";
  }
  if (password.length < 8) {
    return "Password must be at least 8 characters";
  }
  return null;
}

export function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();

    const validationError = validate(username, password);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      await signup(username, email, password);
      navigate("/");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.error ?? "Signup failed");
      } else {
        setError("Something went wrong. Please try again");
      }
    } finally {
      setSubmitting(false);
    }
  }
  const inputClass =
    "rounded-lg border border-line bg-surface px-3 py-2 text-fg focus:outline-none focus:ring-2 focus:ring-primary";
  const labelClass = "text-sm font-medium text-fg-muted";

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6 py-12">
      <h1 className="mb-6 text-2xl font-bold text-fg">Sign up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="username" className={labelClass}>
            Username
          </label>
          <input
            id="username"
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="password" className={labelClass}>
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-primary px-4 py-2 font-semibold text-background transition-colors hover:bg-primary-strong disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Signing up..." : "Sign up"}
        </button>
      </form>
      <p className="mt-6 text-sm text-fg-muted">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-primary">
          Log in
        </Link>
      </p>
    </main>
  );
}
