import { motion } from "motion/react";
import { useCountUp } from "../../hooks/useCountUp";

interface ResultsCardProps {
  clicks: number;
  isNewBest: boolean;
  onPlayAgain: () => void;
}

export function ResultsCard({
  clicks,
  isNewBest,
  onPlayAgain,
}: ResultsCardProps) {
  const displayedClicks = useCountUp(clicks);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-4"
    >
      <h2 className="text-xl font-semibold text-fg">Time's up!</h2>
      <p className="text-5xl font-bold tabular-nums text-primary">
        {displayedClicks}
      </p>
      <p className="text-fg-muted">clicks</p>
      {isNewBest && (
        <motion.p
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary"
        >
          🎉 New personal best!
        </motion.p>
      )}
      <button
        onClick={onPlayAgain}
        className="mt-2 rounded-lg bg-primary px-6 py-2.5 font-semibold text-background transition-colors hover:bg-primary-strong"
      >
        Play again
      </button>
    </motion.div>
  );
}
