import { useEffect, useState } from "react";
import { Navbar } from "../components/layout/Navbar";
import { ModeSelect } from "../components/game/ModeSelect";
import { Timer } from "../components/game/Timer";
import { ClickButton } from "../components/game/ClickButton";
import { ResultsCard } from "../components/game/ResultsCard";
import { startGame as startGameSession, submitGame } from "../api/game.api";

const DURATION_SECONDS = 60;
const COUNTDOWN_START = 3;
const MODE = "classic60";

type GamePhase = "idle" | "countdown" | "playing" | "results";
type SaveStatus = "idle" | "saving" | "saved" | "error";

export function GamePage() {
  const [phase, setPhase] = useState<GamePhase>("idle");
  const [countdownValue, setCountdownValue] = useState(COUNTDOWN_START);
  const [secondsLeft, setSecondsLeft] = useState(DURATION_SECONDS);
  const [clicks, setClicks] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

  useEffect(() => {
    if (phase !== "countdown") return;

    if (countdownValue === 0) {
      setPhase("playing");
      setSecondsLeft(DURATION_SECONDS);
      setClicks(0);
      return;
    }

    const timeout = setTimeout(() => {
      setCountdownValue((value) => value - 1);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [phase, countdownValue]);

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
  // measures elapsed time against. The local 60s timer above is only for
  // display; it has no bearing on whether a submit gets accepted.
  useEffect(() => {
    if (phase !== "playing") return;

    let cancelled = false;
    startGameSession(MODE)
      .then((res) => {
        if (!cancelled) setSessionId(res.sessionId);
      })
      .catch(() => {
        if (!cancelled) setSessionId(null);
      });

    return () => {
      cancelled = true;
    };
  }, [phase]);

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
  }, [phase, sessionId, clicks]);

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
      <main style={{ padding: "2rem", textAlign: "center" }}>
        {phase === "idle" && <ModeSelect onStart={beginCountdown} />}
        {phase === "countdown" && (
          <h1>{countdownValue === 0 ? "Go!" : countdownValue}</h1>
        )}
        {phase === "playing" && (
          <>
            <Timer secondsLeft={secondsLeft} />
            <p>Clicks: {clicks}</p>
            <ClickButton onClick={() => setClicks((c) => c + 1)} />
          </>
        )}
        {phase === "results" && (
          <>
            <ResultsCard clicks={clicks} onPlayAgain={playAgain} />
            {saveStatus === "saving" && <p>Saving score...</p>}
            {saveStatus === "saved" && <p>Score saved!</p>}
            {saveStatus === "error" && (
              <p>Could not save score — check your connection.</p>
            )}
          </>
        )}
      </main>
    </>
  );
}
