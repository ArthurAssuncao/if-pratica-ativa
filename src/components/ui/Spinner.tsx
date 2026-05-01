// hooks/useTimer.ts
import { useTimer } from "hook/useTimer";

interface SpinnerProps {
  onComplete?: () => void;
}

// Componente Spinner usando o hook
export const Spinner = ({ onComplete }: SpinnerProps) => {
  const { isActive } = useTimer({ duration: 3000, onComplete });

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Spinner */}
      <div className="relative w-16 h-16">
        {/* Círculo de fundo */}
        <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>

        {/* Spinner girando */}
        <div
          className={`absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent ${
            isActive ? "animate-spin" : ""
          }`}
          style={{ animationDuration: "1s" }}
        ></div>
      </div>

      {/* Texto "Carregando..." */}
      <span className="text-blue-600 font-medium">Carregando...</span>
    </div>
  );
};
