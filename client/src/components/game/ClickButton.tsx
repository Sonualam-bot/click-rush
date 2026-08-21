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
      className="flex h-52 w-52 items-center justify-center rounded-full bg-primary text-2xl font-bold text-background shadow-lg shadow-primary/20 select-none"
    >
      Click!
    </motion.button>
  );
}
