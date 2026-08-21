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
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
        Time's up!
      </h2>
      <p className="text-5xl font-bold tabular-nums text-violet-600 dark:text-violet-400">
        {displayedClicks}
      </p>
      <p className="text-gray-500 dark:text-gray-400">clicks</p>
      {isNewBest && (
        <motion.p
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="rounded-full bg-amber-100 dark:bg-amber-900/40 px-4 py-1.5 text-sm font-semibold text-amber-700 dark:text-amber-300"
        >
          🎉 New personal best!
        </motion.p>
      )}
      <button
        onClick={onPlayAgain}
        className="mt-2 rounded-lg bg-violet-600 px-6 py-2.5 font-medium text-white transition-colors hover:bg-violet-700"
      >
        Play again
      </button>
    </motion.div>
  );
}
