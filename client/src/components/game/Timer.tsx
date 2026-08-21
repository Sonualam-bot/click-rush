interface TimerProps {
  secondsLeft: number;
}

export function Timer({ secondsLeft }: TimerProps) {
  const isLow = secondsLeft <= 10;

  return (
    <div
      className={`text-5xl font-bold tabular-nums transition-colors ${
        isLow ? "animate-pulse text-red-400" : "text-fg"
      }`}
    >
      {secondsLeft}s
    </div>
  );
}
