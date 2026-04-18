import { RotateCcw } from "lucide-react";

export const ResultScreen = ({
  pontos,
  total,
}: {
  pontos: number;
  total: number;
}) => (
  <div className="max-w-md mx-auto mt-20 p-10 bg-slate-800 rounded-3xl text-center border border-slate-700 shadow-2xl">
    <h2 className="text-3xl font-bold text-white mb-4">Resultado</h2>
    <div className="text-6xl font-black text-blue-500 mb-6">
      {pontos}/{total}
    </div>
    <button
      onClick={() => window.location.reload()}
      className="flex items-center justify-center gap-2 w-full bg-slate-700 p-4 rounded-xl text-white hover:bg-slate-600 transition"
    >
      <RotateCcw size={20} /> Reiniciar Desafio
    </button>
  </div>
);
