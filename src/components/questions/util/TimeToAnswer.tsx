import { Timer, Unlock } from "lucide-react";
import { useEffect, useState } from "react";

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
  // Se o countTimer for false, o tempo inicial já é zero
  const [tempoRestante, setTempoRestante] = useState(countTimer ? segundos : 0);

  useEffect(() => {
    // Se não precisa contar ou já acabou, não faz nada
    if (!countTimer || tempoRestante <= 0) {
      if (tempoRestante <= 0) onTimerEnd();
      return;
    }

    const interval = setInterval(() => {
      setTempoRestante((prev) => {
        const novoTempo = prev - 1;
        if (novoTempo <= 0) {
          clearInterval(interval);
          onTimerEnd(); // Avisa o pai no momento exato que zera
          return 0;
        }
        return novoTempo;
      });
    }, 1000);

    return () => clearInterval(interval);
    // onTimerEnd não deve estar no array para evitar loops se o pai não usar useCallback
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countTimer, segundos]);

  const liberado = tempoRestante <= 0;

  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-500 w-full max-w-md ${
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
  );
};
