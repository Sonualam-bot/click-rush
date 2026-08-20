interface ModeSelectProps {
  onStart: () => void;
}

export function ModeSelect({ onStart }: ModeSelectProps) {
  return (
    <div>
      <h2>Classic — 60 seconds</h2>
      <button onClick={onStart}>Start</button>
    </div>
  );
}
