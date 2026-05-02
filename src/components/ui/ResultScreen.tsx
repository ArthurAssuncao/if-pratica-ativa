import { Frown, RotateCcw, Star, Target, Trophy } from "lucide-react";

export const ResultScreen = ({
  pontos,
  total,
}: {
  pontos: number;
  total: number;
}) => {
  const porcentagem = (pontos / total) * 100;

  // Configuração de feedback baseado no desempenho
  const getFeedback = () => {
    if (porcentagem === 100) {
      return {
        title: "Perfeito!",
        message: "Você dominou o conteúdo! Nível mestre alcançado.",
        color: "text-emerald-500",
        bgColor: "bg-emerald-500/10",
        borderColor: "border-emerald-500/20",
        icon: <Trophy className="text-emerald-500" size={48} />,
      };
    }
    if (porcentagem >= 70) {
      return {
        title: "Mandou muito!",
        message: "Ótimo desempenho. Você está quase lá!",
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
        borderColor: "border-blue-500/20",
        icon: <Star className="text-blue-500" size={48} />,
      };
    }
    if (porcentagem >= 40) {
      return {
        title: "Bom esforço!",
        message: "Você tem uma boa base, mas ainda pode melhorar.",
        color: "text-amber-500",
        bgColor: "bg-amber-500/10",
        borderColor: "border-amber-500/20",
        icon: <Target className="text-amber-500" size={48} />,
      };
    }
    return {
      title: "Não desista!",
      message: "Revisar o conteúdo vai te ajudar a chegar mais longe.",
      color: "text-rose-500",
      bgColor: "bg-rose-500/10",
      borderColor: "border-rose-500/20",
      icon: <Frown className="text-rose-500" size={48} />,
    };
  };

  const feedback = getFeedback();

  return (
    <div className="w-full max-w-md mx-auto p-4 m-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl  flex flex-col items-center text-center">
      {/* Ícone de Destaque */}
      <div className={`p-4 rounded-full mb-6 ${feedback.bgColor}`}>
        {feedback.icon}
      </div>

      <h2 className={`text-3xl font-black mb-2 ${feedback.color}`}>
        {feedback.title}
      </h2>

      <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">
        {feedback.message}
      </p>

      {/* Card de Pontuação */}
      <div
        className={`w-full p-6 rounded-2xl border mb-8 ${feedback.bgColor} ${feedback.borderColor}`}
      >
        <div className="text-slate-500 dark:text-slate-400 text-sm uppercase tracking-widest font-bold mb-1">
          Sua Pontuação
        </div>
        <div className="flex items-baseline justify-center gap-1">
          <span className={`text-6xl font-black ${feedback.color}`}>
            {pontos}
          </span>
          <span className="text-2xl text-slate-400 dark:text-slate-600 font-bold">
            / {total}
          </span>
        </div>

        {/* Barra de Progresso Simples */}
        <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full mt-4 overflow-hidden">
          <div
            className={`h-full transition-all duration-1000 ease-out ${feedback.color.replace("text", "bg")}`}
            style={{ width: `${porcentagem}%` }}
          />
        </div>
      </div>

      <button
        onClick={() => window.location.reload()}
        className="flex items-center justify-center gap-3 w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-lg hover:cursor-pointer"
      >
        <RotateCcw size={20} />
        Tentar Novamente
      </button>
    </div>
  );
};
