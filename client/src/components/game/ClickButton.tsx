import { motion } from "motion/react";

interface ClickButtonProps {
  onClick: () => void;
}

export function ClickButton({ onClick }: ClickButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.9 }}
      className="flex h-52 w-52 items-center justify-center rounded-full bg-violet-600 text-2xl font-bold text-white shadow-lg select-none"
    >
      Click!
    </motion.button>
  );
}
