interface TimerProps {
  secondsLeft: number;
}

export function Timer({ secondsLeft }: TimerProps) {
  return (
    <div style={{ fontSize: "3rem", fontWeight: "bold" }}>{secondsLeft}s</div>
  );
}
