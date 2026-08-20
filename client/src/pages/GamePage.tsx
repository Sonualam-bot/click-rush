import { useEffect, useState } from "react";
import { Navbar } from "../components/layout/Navbar";
import { ModeSelect } from "../components/game/ModeSelect";
import { Timer } from "../components/game/Timer";
import { ClickButton } from "../components/game/ClickButton";
import { ResultsCard } from "../components/game/ResultsCard";

const DURATION_SECONDS = 60;
const COUNTDOWN_START = 3;

type GamePhase = "idle" | "countdown" | "playing" | "results";

export function GamePage() {
  const [phase, setPhase] = useState<GamePhase>("idle");
  const [countdownValue, setCountdownValue] = useState(COUNTDOWN_START);
  const [secondsLeft, setSecondsLeft] = useState(DURATION_SECONDS);
  const [clicks, setClicks] = useState(0);

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

  function startGame() {
    setCountdownValue(COUNTDOWN_START);
    setPhase("countdown");
  }

  function playAgain() {
    setPhase("idle");
  }

  return (
    <>
      <Navbar />
      <main style={{ padding: "2rem", textAlign: "center" }}>
        {phase === "idle" && <ModeSelect onStart={startGame} />}
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
          <ResultsCard clicks={clicks} onPlayAgain={playAgain} />
        )}
      </main>
    </>
  );
}
