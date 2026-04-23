import { DISCIPLINES } from "data/activities";
import { useQuizGenerator } from "hook/useQuizGenerator";
import {
  BarChart3,
  CheckCircle2,
  Layers,
  LayoutGrid,
  Play,
  Settings2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Amount, QuizConfig } from "types/quiz";
import { Level, SavedProgress } from "types/study";
import Quiz from "./Quiz";
import { Breadcrumb } from "./ui/Breadcrumb";
import { ContinueCard } from "./ui/ContinueCard";
import { DisciplineCard } from "./ui/DisciplineCard";
import { OptionSlider } from "./ui/OptionSlider";

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
    level: undefined,
    type: undefined,
    amount: "Livre",
  });

  const [isQuizReady, setIsQuizReady] = useState(false);

  const discipline = DISCIPLINES.find((d) => d.id === config.disciplineId);
  const quiz = useQuizGenerator({
    discipline: discipline || null,
    contentId: config.contentId,
    level: config.level,
    type: config.type,
    limit: config.amount === "Livre" ? undefined : config.amount,
    shuffle: true,
  });

  const selectedDiscipline = useMemo(
    () => DISCIPLINES.find((d) => d.id === config.disciplineId),
    [config.disciplineId],
  );

  const disciplineName = DISCIPLINES.find(
    (d) => d.id === config.disciplineId,
  )?.name;
  const content = DISCIPLINES.find(
    (d) => d.id === config.disciplineId,
  )?.contents.find((c) => c.id === config.contentId);

  const handleStart = () => {
    console.log("Iniciando Quiz:", config);
    setIsQuizReady(true);
  };

  const handleReset = (level: "all" | "discipline") => {
    if (level === "all") {
      setConfig((prev) => ({ ...prev, disciplineId: null, contentId: null }));
    } else {
      setConfig((prev) => ({ ...prev, contentId: null }));
    }
    setIsQuizReady(false);
  };

  return (
    <div className="max-w-full min-w-[50vw] mx-auto p-4 md:p-8 animate-in fade-in duration-500 flex flex-col">
      {/* 1. Continue Section */}

      {MOCK_PROGRESS && !isQuizReady && (
        <ContinueCard
          progress={MOCK_PROGRESS}
          onContinue={() => console.log("Continuando...", MOCK_PROGRESS)}
        />
      )}

      <Breadcrumb
        config={config}
        onReset={handleReset}
        disciplineName={disciplineName || ""}
        contentName={content?.name || ""}
      />

      {isQuizReady && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm items-center justify-center">
          <Quiz quiz={quiz} />
        </div>
      )}

      {!isQuizReady && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm items-center justify-center">
          {/* 2. Breadcrumb */}
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
                  {DISCIPLINES.map((discipline) => (
                    <DisciplineCard
                      key={discipline.id}
                      discipline={discipline}
                      isSelected={config.disciplineId === discipline.id}
                      onSelect={(id) => {
                        const isSame = id === config.disciplineId;

                        setConfig({
                          ...config,
                          disciplineId: isSame ? null : id,
                          contentId: null,
                        });
                      }}
                    />
                  ))}
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
                          w-full flex items-center justify-between gap-2 p-4 rounded-xl border-2 transition-all hover:cursor-pointer
                          ${
                            isSelected
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10"
                              : "border-transparent bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800"
                          }
                        `}
                        >
                          <div className="flex items-center gap-2">
                            {isSelected && (
                              <CheckCircle2
                                size={18}
                                className="text-blue-500"
                              />
                            )}
                            <span
                              className={`font-medium ${isSelected ? "text-blue-600 dark:text-blue-400" : "text-slate-600 dark:text-slate-400"}`}
                            >
                              {content.name}
                            </span>
                          </div>
                          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                            {content.questions?.length || 0}
                          </span>
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
                className={`transition-opacity duration-300 ${
                  config.contentId &&
                  content?.questions &&
                  content?.questions?.length > 0
                    ? "opacity-100"
                    : "opacity-40 pointer-events-none"
                }`}
              >
                <div className="flex items-center gap-2 mb-6">
                  <Settings2 size={20} className="text-blue-500" />
                  <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                    Configurações do Quiz
                  </h2>
                </div>

                {/* Level Filter */}
                <div className="mb-6">
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-500 uppercase tracking-tighter mb-3">
                    <BarChart3 size={14} /> Nível de Dificuldade
                  </label>
                  <OptionSlider
                    options={["Fácil", "Médio", "Difícil", "Todas"]}
                    value={config.level || "Todas"}
                    onChange={(novoValor) =>
                      setConfig({ ...config, level: novoValor as Level })
                    }
                  />
                </div>

                {/* Amount Filter */}
                <div className="mb-8">
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-500 uppercase tracking-tighter mb-3">
                    <Play size={14} /> Quantidade de Questões
                  </label>
                  <OptionSlider
                    options={[10, 20, "Livre"]}
                    value={config.amount || "Livre"}
                    onChange={(novoValor) =>
                      setConfig({ ...config, amount: novoValor as Amount })
                    }
                  />
                </div>

                {/* 6. Action Button */}
                <button
                  disabled={!config.contentId}
                  onClick={handleStart}
                  className={`
                  w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-bold text-lg shadow-lg transition-all hover:cursor-pointer
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
          </div>{" "}
        </div>
      )}
    </div>
  );
}
