import { Target, Trophy, Zap } from "lucide-react";
import { useState } from "react";
import { getStudentLevel } from "util/gamification";

interface StatsData {
  completedQuizzes: number;
  totalQuizzes: number;
  accuracy: number;
  totalQuestions: number;
}

interface UserStatsProps {
  generalStats: StatsData;
  disciplineStats?: StatsData & { name: string };
}

export function UserStatsCard({
  generalStats,
  disciplineStats,
}: UserStatsProps) {
  // Estado para controlar a aba ativa (sempre começa em 'Geral')
  const [activeTab, setActiveTab] = useState<"geral" | "disciplina">("geral");

  // Se não houver disciplina, forçamos a aba geral e nem mostramos os botões
  const hasDiscipline = !!disciplineStats;
  const currentStats =
    hasDiscipline && activeTab === "disciplina"
      ? disciplineStats
      : generalStats;

  const progressPercentage =
    (currentStats.completedQuizzes / currentStats.totalQuizzes) * 100;

  return (
    <div className="flex flex-col gap-4 min-w-48 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-all">
      {/* Sistema de Abas */}
      {hasDiscipline && (
        <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <button
            onClick={() => setActiveTab("geral")}
            className={`flex-1 py-1.5 text-[11px] font-bold uppercase rounded-lg transition-all hover:cursor-pointer ${
              activeTab === "geral"
                ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400"
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 border border-transparent hover:border-slate-300 dark:hover:border-slate-200"
            }`}
          >
            Geral
          </button>
          <button
            onClick={() => setActiveTab("disciplina")}
            className={`flex-1 py-1.5 text-[11px] font-bold uppercase rounded-lg transition-all hover:cursor-pointer truncate px-2 ${
              activeTab === "disciplina"
                ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400"
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 border border-transparent hover:border-slate-300 dark:hover:border-slate-200"
            }`}
          >
            {disciplineStats.name}
          </button>
        </div>
      )}

      {!hasDiscipline && (
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Suas Estatísticas
        </h3>
      )}

      {/* Barra de Progresso */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600 dark:text-slate-300 font-medium">
            Progresso {activeTab === "disciplina" ? "da Matéria" : "Total"}
          </span>
          <span className="text-blue-600 dark:text-blue-400 font-bold">
            {currentStats.completedQuizzes}/{currentStats.totalQuizzes}
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
            {currentStats.accuracy}%
          </span>
        </div>

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
            {currentStats.totalQuestions}
          </span>
        </div>
      </div>

      {/* Rank/Troféu - Dinâmico para a aba selecionada */}
      <div className="flex flex-col xl:flex-row items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
        <div className="p-2 bg-blue-600 rounded-lg text-white">
          <Trophy size={18} />
        </div>
        <div className="overflow-hidden">
          <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase whitespace-nowrap">
            {activeTab === "disciplina"
              ? "Domínio da Disciplina"
              : "Rank Atual Geral"}
          </p>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">
            {
              getStudentLevel(
                currentStats.totalQuestions,
                activeTab === "disciplina" ? "disciplina" : "geral",
              ).title
            }
          </p>
        </div>
      </div>
    </div>
  );
}
