interface TimerProps {
  secondsLeft: number;
}

export function Timer({ secondsLeft }: TimerProps) {
  const isLow = secondsLeft <= 10;

  return (
    <div
      className={`text-5xl font-bold tabular-nums transition-colors ${
        isLow
          ? "animate-pulse text-red-500 dark:text-red-400"
          : "text-gray-900 dark:text-gray-100"
      }`}
    >
      {secondsLeft}s
    </div>
  );
}
