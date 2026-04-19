import { Timer, Unlock } from "lucide-react";
import React, { useEffect, useState } from "react";

interface TimeToResponseProps {
  segundos?: number;
  onTimerEnd: () => void;
}

export const TimeToResponse: React.FC<TimeToResponseProps> = ({
  segundos = 3,
  onTimerEnd,
}) => {
  const [tempoRestante, setTempoRestante] = useState(segundos);

  // 1. O efeito foca APENAS em contar o tempo
  useEffect(() => {
    if (tempoRestante <= 0) return;

    const timer = setInterval(() => {
      setTempoRestante((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [tempoRestante]);

  // 2. O efeito de "Finalização" foca apenas em avisar o pai
  useEffect(() => {
    if (tempoRestante === 0) {
      onTimerEnd();
    }
  }, [tempoRestante, onTimerEnd]);

  // 3. A variável 'liberado' não precisa de um useState!
  // Ela é um "Estado Derivado" (Boa prática!)
  const liberado = tempoRestante <= 0;

  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-500 ${
        liberado
          ? "border-green-500 bg-green-500/10"
          : "border-amber-500 bg-amber-500/10"
      }`}
    >
      {liberado ? (
        <Unlock size={20} className="animate-bounce" />
      ) : (
        <Timer size={20} className="animate-spin-slow" />
      )}

      <span className="font-mono font-bold lg:text-sm">
        {liberado
          ? "Questão liberada para ser respondida."
          : `Aguarde ${tempoRestante}s para responder...`}
      </span>
    </div>
  );
};
