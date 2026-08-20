interface ResultsCardProps {
  clicks: number;
  onPlayAgain: () => void;
}

export function ResultsCard({ clicks, onPlayAgain }: ResultsCardProps) {
  return (
    <div>
      <h2>Time's up!</h2>
      <p>You clicked {clicks} times</p>
      <button onClick={onPlayAgain}>Play again</button>
    </div>
  );
}
