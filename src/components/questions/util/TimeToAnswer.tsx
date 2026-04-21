import { Timer, Unlock } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface TimeToAnswerProps {
  segundos?: number;
  countTimer?: boolean;
  onTimerEnd: () => void;
}

export const TimeToAnswer = ({
  segundos = 3,
  countTimer = true,
  onTimerEnd,
}: TimeToAnswerProps) => {
  const [tempoRestante, setTempoRestante] = useState(countTimer ? segundos : 0);
  const [isHiding, setIsHiding] = useState(false);
  const hasEnded = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!countTimer) {
      if (!hasEnded.current) {
        hasEnded.current = true;
        setIsHiding(true);
        setTimeout(() => onTimerEnd(), 800); // Aguarda animação terminar
      }
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTempoRestante(0);
      return;
    }

    if (tempoRestante <= 0) {
      if (!hasEnded.current) {
        hasEnded.current = true;
        setIsHiding(true);
        setTimeout(() => onTimerEnd(), 800); // Aguarda animação terminar
      }
      return;
    }

    const interval = setInterval(() => {
      setTempoRestante((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [countTimer, onTimerEnd, tempoRestante]);

  const liberado = tempoRestante <= 0;

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden w-full transition-all duration-1000 ease-in-out mt-4 ${
        isHiding
          ? "max-h-0 opacity-0 mb-0 scale-y-0"
          : "max-h-40 opacity-100 mb-4 scale-y-100"
      }`}
      style={{
        transformOrigin: "top",

        transitionDelay: isHiding ? "3000ms" : "0ms",
      }}
    >
      <div
        className={`flex items-center gap-3 p-4 rounded-lg border transition-colors duration-500 ${
          liberado
            ? "border-green-500 bg-green-500/10 text-green-700 dark:text-green-400"
            : "border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-400"
        }`}
      >
        <div className="shrink-0">
          {liberado ? (
            <Unlock size={20} className="animate-bounce" />
          ) : (
            <Timer size={20} className="animate-pulse" />
          )}
        </div>
        <span className="font-medium text-sm lg:text-base">
          {liberado
            ? "Agora você pode responder à pergunta."
            : `Aguarde ${tempoRestante}s para responder...`}
        </span>
      </div>
    </div>
  );
};
