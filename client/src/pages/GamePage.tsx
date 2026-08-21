import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Navbar } from "../components/layout/Navbar";
import { ModeSelect } from "../components/game/ModeSelect";
import { Timer } from "../components/game/Timer";
import { ClickButton } from "../components/game/ClickButton";
import { ResultsCard } from "../components/game/ResultsCard";
import { startGame as startGameSession, submitGame } from "../api/game.api";
import { fetchStats } from "../api/user.api";
import { GAME_MODES, getModeDuration } from "../config/modes";

const COUNTDOWN_START = 3;
const DEFAULT_MODE = GAME_MODES[0].id;

type GamePhase = "idle" | "countdown" | "playing" | "results";
type SaveStatus = "idle" | "saving" | "saved" | "error";

export function GamePage() {
  const [selectedMode, setSelectedMode] = useState(DEFAULT_MODE);
  const [phase, setPhase] = useState<GamePhase>("idle");
  const [countdownValue, setCountdownValue] = useState(COUNTDOWN_START);
  const [secondsLeft, setSecondsLeft] = useState(getModeDuration(DEFAULT_MODE));
  const [clicks, setClicks] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [personalBests, setPersonalBests] = useState<Record<string, number>>(
    {},
  );

  // Snapshotted once, right when a game starts, and never touched again
  // until the next game — a fixed baseline to compare the final score
  // against, rather than re-reading personalBests (which this same game's
  // own result is about to update) at "results" time.
  const previousBestRef = useRef(0);

  // Loaded once on mount so the very first game already has a real
  // baseline to compare against, instead of treating "no data yet" as
  // "best score is 0" and awarding an undeserved personal-best banner.
  useEffect(() => {
    fetchStats()
      .then((stats) => {
        const bests: Record<string, number> = {};
        for (const m of stats.byMode) bests[m.mode] = m.bestScore;
        setPersonalBests(bests);
      })
      .catch(() => {
        // Non-critical — worst case the personal-best callout just
        // doesn't fire for the first game for this session.
      });
  }, []);

  useEffect(() => {
    if (phase !== "countdown") return;

    if (countdownValue === 0) {
      setPhase("playing");
      setSecondsLeft(getModeDuration(selectedMode));
      setClicks(0);
      return;
    }

    const timeout = setTimeout(() => {
      setCountdownValue((value) => value - 1);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [phase, countdownValue, selectedMode]);

  useEffect(() => {
    if (phase !== "playing") return;

    if (secondsLeft === 0) {
      setPhase("results");
      return;
    }

    const timeout = setTimeout(() => {
      setSecondsLeft((value) => value - 1);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [phase, secondsLeft]);

  // Fires exactly once per game, the moment "playing" begins — asks the
  // server to stamp its own startedAt, which is what submitSession later
  // measures elapsed time against. The local timer above is only for
  // display; it has no bearing on whether a submit gets accepted.
  useEffect(() => {
    if (phase !== "playing") return;

    previousBestRef.current = personalBests[selectedMode] ?? 0;

    let cancelled = false;
    startGameSession(selectedMode)
      .then((res) => {
        if (!cancelled) setSessionId(res.sessionId);
      })
      .catch(() => {
        if (!cancelled) setSessionId(null);
      });

    return () => {
      cancelled = true;
    };
  }, [phase, selectedMode, personalBests]);

  // Fires once, the moment "results" begins — persists the score the
  // player actually racked up. If /game/start never resolved (no
  // sessionId), there's nothing to submit against.
  useEffect(() => {
    if (phase !== "results") return;

    if (!sessionId) {
      setSaveStatus("error");
      return;
    }

    setSaveStatus("saving");
    submitGame(sessionId, clicks)
      .then(() => setSaveStatus("saved"))
      .catch(() => setSaveStatus("error"));

    if (clicks > previousBestRef.current) {
      setPersonalBests((prev) => ({
        ...prev,
        [selectedMode]: Math.max(prev[selectedMode] ?? 0, clicks),
      }));
    }
  }, [phase, sessionId, clicks, selectedMode]);

  const isNewBest =
    phase === "results" && clicks > 0 && clicks > previousBestRef.current;

  function beginCountdown() {
    setCountdownValue(COUNTDOWN_START);
    setPhase("countdown");
  }

  function playAgain() {
    setPhase("idle");
    setSessionId(null);
    setSaveStatus("idle");
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto flex max-w-2xl flex-col items-center gap-4 px-6 py-16 text-center">
        {phase === "idle" && (
          <ModeSelect
            selectedMode={selectedMode}
            onSelectMode={setSelectedMode}
            onStart={beginCountdown}
          />
        )}

        {phase === "countdown" && (
          <AnimatePresence mode="wait">
            <motion.h1
              key={countdownValue}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.3 }}
              transition={{ duration: 0.3 }}
              className="text-7xl font-bold text-violet-600 dark:text-violet-400"
            >
              {countdownValue === 0 ? "Go!" : countdownValue}
            </motion.h1>
          </AnimatePresence>
        )}

        {phase === "playing" && (
          <div className="flex flex-col items-center gap-6">
            <Timer secondsLeft={secondsLeft} />
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Clicks: <span className="font-semibold">{clicks}</span>
            </p>
            <ClickButton onClick={() => setClicks((c) => c + 1)} />
          </div>
        )}

        {phase === "results" && (
          <div className="flex flex-col items-center gap-3">
            <ResultsCard
              clicks={clicks}
              isNewBest={isNewBest}
              onPlayAgain={playAgain}
            />
            {saveStatus === "saving" && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Saving score...
              </p>
            )}
            {saveStatus === "saved" && (
              <p className="text-sm text-green-600 dark:text-green-400">
                Score saved!
              </p>
            )}
            {saveStatus === "error" && (
              <p className="text-sm text-red-600 dark:text-red-400">
                Could not save score — check your connection.
              </p>
            )}
          </div>
        )}
      </main>
    </>
  );
}
