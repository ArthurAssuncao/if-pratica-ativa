import { useEffect, useState } from "react";

interface UseTimerProps {
  duration: number;
  onComplete?: () => void;
}

export const useTimer = ({ duration = 3000, onComplete }: UseTimerProps) => {
  const [isActive, setIsActive] = useState(true);
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (!isActive) return;

    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, duration - elapsed);
      setTimeLeft(remaining);

      if (remaining === 0) {
        clearInterval(timer);
        setIsActive(false);
        if (onComplete) onComplete();
      }
    }, 16); // ~60fps para animação suave

    return () => clearInterval(timer);
  }, [duration, isActive, onComplete]);

  return {
    isActive,
    timeLeft,
    progress: ((duration - timeLeft) / duration) * 100,
  };
};
