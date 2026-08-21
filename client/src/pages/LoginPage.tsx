import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import axios from "axios";
import type { SyntheticEvent } from "react";

export function LoginPage() {
  const { login, guest } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.error ?? "Login failed");
      } else {
        setError("Something went wrong. Please try again");
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGuest() {
    setError(null);
    setSubmitting(true);
    try {
      await guest();
      navigate("/");
    } catch {
      setError("Could not start a guest session. Please try again");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6 py-12">
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
        Log in
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label
            htmlFor="email"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label
            htmlFor="password"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-violet-600 px-4 py-2 font-medium text-white transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Logging in..." : "Log in"}
        </button>
      </form>
      <button
        onClick={handleGuest}
        disabled={submitting}
        className="mt-3 rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 font-medium text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Continue as guest
      </button>
      <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
        No account?{" "}
        <Link to="/signup" className="text-violet-600 dark:text-violet-400 font-medium">
          Sign up
        </Link>
      </p>
    </main>
  );
}
