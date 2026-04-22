import { DISCIPLINES } from "data/atividades";
import {
  BarChart3,
  CheckCircle2,
  Layers,
  LayoutGrid,
  Play,
  Settings2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Amount, Nivel, QuizConfig } from "types/quiz";
import { SavedProgress } from "types/study";
import { Breadcrumb } from "./ui/Breadcrumb";
import { ContinueCard } from "./ui/ContinueCard";

const MOCK_PROGRESS: SavedProgress = {
  disciplineId: "mat",
  disciplineName: "Matemática",
  contentId: "mat-1",
  contentName: "Funções de Primeiro Grau",
  remaining: 12,
};

// --- Components ---

// --- Main Component ---

export default function StudySelectionPage() {
  const [config, setConfig] = useState<QuizConfig>({
    disciplineId: null,
    contentId: null,
    level: "iniciante",
    amount: 10,
  });

  const selectedDiscipline = useMemo(
    () => DISCIPLINES.find((d) => d.id === config.disciplineId),
    [config.disciplineId],
  );

  const disciplineName = DISCIPLINES.find(
    (d) => d.id === config.disciplineId,
  )?.name;
  const contentName = DISCIPLINES.find(
    (d) => d.id === config.disciplineId,
  )?.contents.find((c) => c.id === config.contentId)?.name;

  const handleStart = () => {
    console.log("Iniciando Quiz:", config);
    // Integração com o módulo de Quiz funcional
  };

  const handleReset = (level: "all" | "discipline") => {
    if (level === "all")
      setConfig((prev) => ({ ...prev, disciplineId: null, contentId: null }));
    else setConfig((prev) => ({ ...prev, contentId: null }));
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 animate-in fade-in duration-500">
      {/* 1. Continue Section */}
      {MOCK_PROGRESS && (
        <ContinueCard
          progress={MOCK_PROGRESS}
          onContinue={() => console.log("Continuando...", MOCK_PROGRESS)}
        />
      )}

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm">
        {/* 2. Breadcrumb */}
        <Breadcrumb
          config={config}
          onReset={handleReset}
          disciplineName={disciplineName || ""}
          contentName={contentName || ""}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7">
            {/* 3. Discipline Selection */}
            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <LayoutGrid size={20} className="text-blue-500" />
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                  Selecione a Disciplina
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {DISCIPLINES.map((discipline) => {
                  const isSelected = config.disciplineId === discipline.id;
                  return (
                    <button
                      key={discipline.id}
                      onClick={() =>
                        setConfig({
                          ...config,
                          disciplineId: discipline.id,
                          contentId: null,
                        })
                      }
                      className={`
                        flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200 hover:cursor-pointer
                        ${
                          isSelected
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 ring-2 ring-blue-200 dark:ring-blue-500/20"
                            : "border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600 bg-slate-50 dark:bg-slate-800/50"
                        }
                      `}
                    >
                      {discipline.icon}
                      <span className="font-bold text-sm text-center">
                        {discipline.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* 4. Content Selection (Accordion Style) */}
            {selectedDiscipline && (
              <section className="animate-in slide-in-from-top-4 duration-300">
                <div className="flex items-center gap-2 mb-4">
                  <Layers size={20} className="text-blue-500" />
                  <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                    Conteúdos de {selectedDiscipline.name}
                  </h2>
                </div>
                <div className="space-y-2">
                  {selectedDiscipline.contents.map((content) => {
                    const isSelected = config.contentId === content.id;
                    return (
                      <button
                        key={content.id}
                        onClick={() =>
                          setConfig({ ...config, contentId: content.id })
                        }
                        className={`
                          w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all hover:cursor-pointer
                          ${
                            isSelected
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10"
                              : "border-transparent bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800"
                          }
                        `}
                      >
                        <span
                          className={`font-medium ${isSelected ? "text-blue-700 dark:text-blue-400" : "text-slate-600 dark:text-slate-400"}`}
                        >
                          {content.name}
                        </span>
                        {isSelected && (
                          <CheckCircle2 size={18} className="text-blue-500" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </section>
            )}
          </div>

          <div className="lg:col-span-5 space-y-8">
            {/* 5. Filters */}
            <section
              className={`transition-opacity duration-300 ${config.contentId ? "opacity-100" : "opacity-40 pointer-events-none"}`}
            >
              <div className="flex items-center gap-2 mb-6">
                <Settings2 size={20} className="text-blue-500" />
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                  Configurações
                </h2>
              </div>

              {/* Level Filter */}
              <div className="mb-6">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-500 uppercase tracking-tighter mb-3">
                  <BarChart3 size={14} /> Nível de Dificuldade
                </label>
                <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                  {["Fácil", "Médio", "Difícil"].map((l) => (
                    <button
                      key={l}
                      onClick={() =>
                        setConfig({ ...config, level: l as Nivel })
                      }
                      className={`
                        flex-1 py-2 text-sm font-bold rounded-lg transition-all
                        ${
                          config.level === l
                            ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm"
                            : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                        }
                      `}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount Filter */}
              <div className="mb-8">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-500 uppercase tracking-tighter mb-3">
                  <Play size={14} /> Quantidade de Questões
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[10, 20, "Livre"].map((a) => (
                    <button
                      key={a}
                      onClick={() =>
                        setConfig({ ...config, amount: a as Amount })
                      }
                      className={`
                        py-2 text-sm font-bold rounded-xl border-2 transition-all
                        ${
                          config.amount === a
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400"
                            : "border-slate-100 dark:border-slate-800 text-slate-500 hover:border-slate-300"
                        }
                      `}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              {/* 6. Action Button */}
              <button
                disabled={!config.contentId}
                onClick={handleStart}
                className={`
                  w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-bold text-lg shadow-lg transition-all
                  ${
                    config.contentId
                      ? "bg-blue-600 hover:bg-blue-700 text-white translate-y-0"
                      : "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                  }
                `}
              >
                Começar {config.amount === "Livre" ? "" : config.amount}{" "}
                questões
                <Play size={20} fill="currentColor" />
              </button>
            </section>
          </div>
        </div>

        {/* 7. Inline Questions Placeholder */}
        <div className="mt-12 pt-8 border-t border-dashed border-slate-200 dark:border-slate-800 text-center">
          <p className="text-slate-400 text-sm italic">
            Selecione uma disciplina e conteúdo para visualizar a prévia das
            questões abaixo.
          </p>
        </div>
      </div>
    </div>
  );
}
