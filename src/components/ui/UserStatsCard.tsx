import { Target, Trophy, Zap } from "lucide-react"; // Usando lucide-react para ícones
import { getStudentLevel } from "util/gamification";

interface UserStatsProps {
  completedQuizzes: number;
  totalQuizzes: number;
  accuracy: number;
  totalQuestions: number;
}

export function UserStatsCard({
  completedQuizzes = 0,
  totalQuizzes = 10,
  accuracy = 0,
  totalQuestions = 0,
}: UserStatsProps) {
  const progressPercentage = (completedQuizzes / totalQuizzes) * 100;

  return (
    <div className="flex flex-col gap-4 min-w-48 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
        Suas Estatísticas
      </h3>

      {/* Barra de Progresso de Quizzes */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600 dark:text-slate-300 font-medium">
            Progresso
          </span>
          <span className="text-blue-600 dark:text-blue-400 font-bold">
            {completedQuizzes}/{totalQuizzes}
          </span>
        </div>
        <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Grid de Mini Stats */}
      <div className="grid grid-cols-2 gap-3">
        {/* Precisão */}
        <div className="flex flex-col p-3 lg:p-2 xl:p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-1">
            <Target
              size={14}
              className="text-emerald-500 block lg:hidden xl:block"
            />
            <span className="text-[10px] text-slate-500 uppercase font-bold">
              Precisão
            </span>
          </div>
          <span className="text-lg font-bold text-slate-800 dark:text-slate-100">
            {accuracy}%
          </span>
        </div>

        {/* Total de Pontos */}
        <div className="flex flex-col p-3 lg:p-2 xl:p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-1">
            <Zap
              size={14}
              className="text-amber-500 block lg:hidden xl:block"
            />
            <span className="text-[10px] text-slate-500 uppercase font-bold">
              Questões
            </span>
          </div>
          <span className="text-lg font-bold text-slate-800 dark:text-slate-100">
            {totalQuestions}
          </span>
        </div>
      </div>

      {/* Rank/Troféu (Opcional) */}
      <div className="flex flex-col xl:flex-row items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
        <div className="p-2 bg-blue-600 rounded-lg text-white">
          <Trophy size={18} />
        </div>
        <div>
          <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase">
            Rank Atual
          </p>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
            {getStudentLevel(totalQuestions).title}
          </p>
        </div>
      </div>
    </div>
  );
}
