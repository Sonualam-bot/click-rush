import { useEffect, useState } from "react";

/**
 * Animates a number from 0 up to `target` over `durationMs`, using
 * requestAnimationFrame directly rather than a motion-library value —
 * plain React state, easy to reason about, no dependency on how a
 * particular animation library chooses to render numeric children.
 */
export function useCountUp(target: number, durationMs = 800): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    let frame: number;

    function step(timestamp: number) {
      if (startTime === null) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / durationMs, 1);
      setValue(Math.round(progress * target));
      if (progress < 1) frame = requestAnimationFrame(step);
    }

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, durationMs]);

  return value;
}
