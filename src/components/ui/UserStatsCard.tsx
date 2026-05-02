import { useAuth } from "hook/useAuth";
import { useUserProgress } from "hook/useDatabase";
import { Target, Trophy, Zap } from "lucide-react";
import { useMemo, useState } from "react";
import type { Discipline } from "types/study";
import { getStudentLevel } from "util/gamification";
import { UserStat } from "./UserStatsCard/UserStat";

interface UserStatsProps {
  discipline?: Discipline;
}

interface StatsData {
  realized: number;
  correct: number;
  attempts: number;
  accuracy: number;
}

export function UserStatsCard({ discipline }: UserStatsProps) {
  // Estado para controlar a aba ativa (sempre começa em 'Geral')
  const [activeTab, setActiveTab] = useState<"geral" | "disciplina">("geral");

  // Se não houver disciplina, forçamos a aba geral e nem mostramos os botões
  const hasDiscipline = !!discipline;

  const { user } = useAuth();
  const { data: userProgress } = useUserProgress(user?.id);

  const stats: StatsData = useMemo(() => {
    if (!userProgress || userProgress.length === 0) {
      return { realized: 0, correct: 0, attempts: 0, accuracy: 0 };
    }

    const realized = userProgress.length;
    const correct = userProgress.filter((curr) => curr.isCorrect).length;
    const attempts = userProgress.reduce((acc, curr) => acc + curr.attempts, 0);

    // Exemplo usando os totais calculados acima
    const accuracy = attempts > 0 ? (correct / attempts) * 100 : 0;

    return { realized, correct, attempts, accuracy };
  }, [userProgress]);

  const statsDiscipline = useMemo(() => {
    if (!discipline || !userProgress || userProgress.length === 0)
      return { realized: 0, correct: 0, attempts: 0, accuracy: 0 };
    const realized = userProgress.filter(
      (curr) => curr.disciplineSlug === discipline.id,
    ).length;
    const correct = userProgress.filter(
      (curr) => curr.disciplineSlug === discipline.id && curr.isCorrect,
    ).length;
    const attempts = userProgress
      .filter((curr) => curr.disciplineSlug === discipline.id)
      .reduce((acc, curr) => acc + curr.attempts, 0);

    // Exemplo usando os totais calculados acima
    const accuracy = attempts > 0 ? (correct / attempts) * 100 : 0;

    return { realized, correct, attempts, accuracy };
  }, [discipline, userProgress]);

  const generalStats = stats;
  const disciplineStats = statsDiscipline;

  const currentStats =
    hasDiscipline && activeTab === "disciplina"
      ? disciplineStats
      : generalStats;

  return (
    <div className="flex flex-col gap-4 min-w-48 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-all">
      {/* Sistema de Abas */}
      {hasDiscipline && (
        <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl ">
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
            {discipline?.name}
          </button>
        </div>
      )}

      {!hasDiscipline && (
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Suas Estatísticas
        </h3>
      )}

      {/* Barra de Progresso */}

      {/* Grid de Mini Stats */}
      <div className="grid grid-cols-2 gap-3">
        <UserStat
          title={<>Precisão</>}
          value={`${Math.ceil(currentStats.accuracy)}%`}
          icon={
            <Target
              size={14}
              className="text-emerald-500 block lg:hidden xl:block"
            />
          }
        />

        <UserStat
          title={<>Corretas</>}
          value={currentStats.correct}
          icon={
            <Zap
              size={14}
              className="text-amber-500 block lg:hidden xl:block"
            />
          }
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <UserStat
          title={
            <>
              <span>Respondidas</span> <span>(únicas)</span>
            </>
          }
          value={currentStats.realized}
          icon={
            <Target
              size={14}
              className="text-emerald-500 block lg:hidden xl:block"
            />
          }
        />

        <UserStat
          title={<>Tentativas</>}
          value={currentStats.attempts}
          icon={
            <Zap
              size={14}
              className="text-amber-500 block lg:hidden xl:block"
            />
          }
        />
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
                currentStats.realized,
                activeTab === "disciplina" ? "disciplina" : "geral",
              ).title
            }
          </p>
        </div>
      </div>
    </div>
  );
}
