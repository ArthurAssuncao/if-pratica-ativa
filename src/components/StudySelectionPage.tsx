import { useAuth } from "hook/useAuth";
import {
  useContentsWithQuestions,
  useDisciplines,
  useLessons,
} from "hook/useDatabase";
import { useIsMobile } from "hook/useIsMobile";
import { useQuizGenerator } from "hook/useQuizGenerator";
import {
  BarChart3,
  Book,
  CheckCircle2,
  ChevronDown,
  Layers,
  LayoutGrid,
  Play,
  Settings2,
} from "lucide-react";
import netlifyIdentity from "netlify-identity-widget";
import { useMemo, useState } from "react";
import type { Amount, QuizConfig } from "types/quiz";
import type { Level, SavedProgress } from "types/study";
import { SidebarSumario } from "./lesson/SidebarSumario";
import { Textbook } from "./lesson/Textbook";
import Quiz from "./Quiz";
import { Breadcrumb } from "./ui/Breadcrumb";
import { ContinueCard } from "./ui/ContinueCard";
import { DisciplineCard } from "./ui/DisciplineCard";
import { OptionSlider } from "./ui/OptionSlider";
import { Sidebar } from "./ui/Sidebar";
import { ThemeToggle } from "./ui/ThemeToggle";
import { UserStatsCard } from "./ui/UserStatsCard";

const MOCK_PROGRESS: SavedProgress = {
  disciplineId: "mat",
  disciplineName: "Matemática",
  contentId: "mat-1",
  contentName: "Funções de Primeiro Grau",
  remaining: 12,
};

export default function StudySelectionPage() {
  const [config, setConfig] = useState<QuizConfig>({
    disciplineId: null,
    contentId: null,
    level: undefined,
    type: undefined,
    amount: "Livre",
  });

  const [isQuizReady, setIsQuizReady] = useState(false);
  const [isLessonReady, setIsLessonReady] = useState(false);
  const [hasContentSelected, setHasContentSelected] = useState(false);
  useState(false);
  const [isContentOptionsVisible, setIsContentOptionsVisible] = useState(true);
  const isMobile = useIsMobile();

  const { data: disciplinesData } = useDisciplines();

  const disciplines = useMemo(() => disciplinesData || [], [disciplinesData]);

  const discipline = disciplines.find((d) => d.id === config.disciplineId);

  const user = useAuth();

  const selectedDiscipline = useMemo(
    () => disciplines.find((d) => d.id === config.disciplineId),
    [config.disciplineId, disciplines],
  );

  const disciplineName = disciplines.find(
    (d) => d.id === config.disciplineId,
  )?.name;

  const { data: contentsData } = useContentsWithQuestions(
    config?.disciplineId || undefined,
  );
  const contents = useMemo(() => contentsData || [], [contentsData]);

  const content = contents.find((c) => c.id === config.contentId);

  const { data: lessonsData } = useLessons(config?.disciplineId || undefined);

  const lesson = useMemo(
    () => lessonsData?.find((l) => l.id === config.contentId),
    [config.contentId, lessonsData],
  );

  const sectionEnabled =
    (config.contentId &&
      content?.questions &&
      content?.questions?.length > 0) ||
    false;

  const quiz = useQuizGenerator({
    discipline: discipline || null,
    selectedContent: content || null,
    level: config.level,
    type: config.type,
    limit: config.amount === "Livre" ? undefined : config.amount,
    shuffle: true,
  });

  const handleStart = () => {
    console.log("Iniciando Quiz:", config);
    setIsQuizReady(true);
  };

  const handleStartLesson = () => {
    console.log("Iniciando Aula:", config);
    setIsLessonReady(true);
  };

  const handleReset = (level: "all" | "discipline") => {
    if (level === "all") {
      setConfig((prev) => ({ ...prev, disciplineId: null, contentId: null }));
    } else {
      setConfig((prev) => ({ ...prev, contentId: null }));
      setHasContentSelected(false);
    }
    setIsLessonReady(false);
    setIsQuizReady(false);
  };

  const handleOpenCloseContentOptions = () => {
    setIsContentOptionsVisible((prev) => !prev);
  };

  const handleLessonChange = (newLessonId: string) => {
    console.log("handleLessonChange", newLessonId);
    const newLesson = lessonsData?.find((l) => l.id === newLessonId);
    if (!newLesson) return;
    setConfig({ ...config, contentId: newLesson.id });
    setHasContentSelected(true);
    setIsContentOptionsVisible(false);
  };

  const handleLessonOrderChange = (newLessonOrder: number) => {
    const newLesson = lessonsData?.find((l) => l.order === newLessonOrder);
    if (!newLesson) return;
    setConfig({ ...config, contentId: newLesson.id });
    setHasContentSelected(true);
    setIsContentOptionsVisible(false);
  };

  const handleLogout = () => {
    console.log("Logout");
    netlifyIdentity.logout();
  };

  return (
    <div className="flex flex-row items-stretch">
      <Sidebar className="self-stretch md:flex-1/3 lg:flex-1/3 w-3/4 md:w-1/3 p-0 lg:p-8 lg:pr-0 md:pr-0 animate-in fade-in duration-500 flex flex-col gap-4 ">
        <div className="h-full lg:rounded-2xl p-0 shadow border  bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
          {user && user.user_metadata && user.user_metadata.full_name && (
            <div className="flex flex-col xl:flex-row items-center gap-2 xl:gap-4 p-4 rounded-t-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
              <img
                src={user.user_metadata.avatar_url}
                alt={user.user_metadata.full_name}
                className="w-12 h-12 rounded-full border-2 border-blue-500"
              />

              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-200">
                  Olá,{" "}
                  <span className="text-slate-900 dark:text-white font-bold">
                    {user.user_metadata.full_name.split(" ")[0]}
                  </span>{" "}
                  👋
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-200 truncate max-w-37.5">
                  {user.email}
                </span>
                {isMobile && <ThemeToggle />}
                <button
                  onClick={handleLogout}
                  className="mt-2 text-xs bg-slate-200 text-slate-900 hover:text-red-700 transition-all rounded-2xl py-2 hover:cursor-pointer hover:shadow-md hover:shadow-slate-200"
                >
                  Sair
                </button>
              </div>
            </div>
          )}
          <div className="flex flex-col gap-4 p-4 pb-0">
            {isLessonReady && selectedDiscipline && lesson && (
              <SidebarSumario
                lessons={lessonsData || []}
                handleLessonChange={handleLessonChange}
              />
            )}
            <UserStatsCard
              completedQuizzes={0}
              totalQuizzes={10}
              accuracy={0}
              totalQuestions={0}
            />
          </div>
        </div>
      </Sidebar>

      <div className=" max-w-full p-4 md:p-8 animate-in fade-in duration-500 flex flex-col gap-4">
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

        {isLessonReady && selectedDiscipline && lesson && (
          <Textbook
            lesson={lesson}
            discipline={selectedDiscipline}
            onLessonChange={handleLessonOrderChange}
          />
        )}

        {isQuizReady && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm items-center justify-center">
            <Quiz quiz={quiz} />
          </div>
        )}

        {!isQuizReady && !isLessonReady && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm items-center justify-center">
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
                    {disciplines.map((discipline) => (
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
                          setHasContentSelected(false);
                          setIsContentOptionsVisible(true);
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
                      {contents.map((content) => {
                        const isSelected = config.contentId === content.id;
                        return (
                          <button
                            key={content.id}
                            onClick={() => {
                              setConfig({ ...config, contentId: content.id });
                              setHasContentSelected(true);
                              setIsContentOptionsVisible(false);
                            }}
                            className={`
                          w-full flex items-center justify-between gap-2 p-4 rounded-xl border-2 transition-all hover:cursor-pointer
                          ${
                            isSelected
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10"
                              : "border-transparent bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800"
                          }
                          ${!isSelected && hasContentSelected && !isContentOptionsVisible ? "hidden" : "block"}
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
                      {contents.length === 0 && (
                        <span>Nenhum conteúdo disponível</span>
                      )}
                      {hasContentSelected && (
                        <div className="flex items-center justify-center gap-2 mb-4">
                          <button
                            onClick={handleOpenCloseContentOptions}
                            className="text-blue-600 hover:text-blue-700 flex gap-2 items-center p-2 px-4 transition-colors font-medium hover:cursor-pointer"
                          >
                            {isContentOptionsVisible ? (
                              <>
                                <ChevronDown size={20} className="rotate-180" />
                                <span>Esconder conteúdos</span>
                              </>
                            ) : (
                              <>
                                <ChevronDown size={20} />
                                <span>Esconder conteúdos</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </section>
                )}
              </div>

              <div className="lg:col-span-5 space-y-8">
                {/* 5. Filters */}
                <section
                  className={`transition-opacity duration-300 ${
                    sectionEnabled
                      ? "opacity-100 **:cursor-auto"
                      : "opacity-40 **:pointer-not-allowed"
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
                      disabled={!sectionEnabled}
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
                      disabled={!sectionEnabled}
                      onChange={(novoValor) =>
                        setConfig({ ...config, amount: novoValor as Amount })
                      }
                    />
                  </div>

                  {/* 6. Action Button */}
                  <button
                    onClick={handleStart}
                    disabled={!sectionEnabled}
                    className={`
                  w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-bold text-lg shadow-lg transition-all
                  ${
                    sectionEnabled
                      ? "bg-blue-600 hover:bg-blue-700 text-white translate-y-0 hover:cursor-pointer"
                      : "bg-slate-200 dark:bg-slate-800 text-slate-400 hover:cursor-not-allowed"
                  }
                    `}
                  >
                    Começar {config.amount === "Livre" ? "" : config.amount}{" "}
                    questões
                    <Play size={20} fill="currentColor" />
                  </button>
                </section>
                {selectedDiscipline && lesson && (
                  <section
                    className={`transition-opacity duration-300 ${
                      sectionEnabled
                        ? "opacity-100 **:cursor-auto"
                        : "opacity-40 **:cursor-not-allowed"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-6">
                      <Book size={20} className="text-blue-500" />
                      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                        Material de Estudos
                      </h2>
                    </div>
                    <button
                      onClick={handleStartLesson}
                      disabled={!sectionEnabled}
                      className={`
                  w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-bold text-lg shadow-lg transition-all 
                
                  ${
                    sectionEnabled
                      ? "bg-blue-600 hover:bg-blue-700 text-white translate-y-0 hover:cursor-pointer"
                      : "bg-slate-200 dark:bg-slate-800 text-slate-400 hover:cursor-not-allowed"
                  }
                `}
                    >
                      Ler material
                      <Play size={20} fill="currentColor" />
                    </button>
                  </section>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
