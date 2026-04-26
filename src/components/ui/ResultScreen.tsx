import { RotateCcw } from "lucide-react";

export const ResultScreen = ({
  pontos,
  total,
}: {
  pontos: number;
  total: number;
}) => (
  <div className="flex flex-col items-center justify-center  p-10 bg-slate-100 dark:bg-slate-800 rounded-2xl text-center border border-slate-300 dark:border-slate-700 shadow-2xl">
    <h2 className="text-3xl font-bold text-slate-700 dark:text-white mb-4">
      Resultado
    </h2>
    <div className="text-6xl font-black text-blue-600 mb-6">
      {pontos}/{total}
    </div>
    <button
      onClick={() => window.location.reload()}
      className="flex items-center justify-center gap-2 w-full bg-blue-500 dark:bg-slate-700 p-4 rounded-lg text-white hover:bg-blue-700 dark:hover:bg-slate-600 transition"
    >
      <RotateCcw size={20} /> Reiniciar Desafio
    </button>
  </div>
);
