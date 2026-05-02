import { useAuth } from "hook/useAuth";
import {
  useContentsWithQuestions,
  useDisciplines,
  useLessons,
} from "hook/useDatabase";
import { useIsMobile } from "hook/useIsMobile";
import { useQuizGenerator } from "hook/useQuizGenerator";
import netlifyIdentity from "netlify-identity-widget";
import { useMemo, useState } from "react";
import type { QuizConfig } from "types/quiz";
import type { SavedProgress } from "types/study";
import { isLocalhost } from "util/localhost";

export type ViewMode = "selection" | "quiz" | "lesson";

export const MOCK_PROGRESS: SavedProgress = {
  disciplineId: "mat",
  disciplineName: "Matemática",
  contentId: "mat-1",
  contentName: "Funções de Primeiro Grau",
  remaining: 12,
};

export function useStudyPage() {
  const [config, setConfig] = useState<QuizConfig>({
    disciplineId: null,
    contentId: null,
    level: undefined,
    type: undefined,
    amount: "Livre",
  });

  const [viewMode, setViewMode] = useState<ViewMode>("selection");
  const [hasContentSelected, setHasContentSelected] = useState(false);
  const [isContentOptionsVisible, setIsContentOptionsVisible] = useState(true);
  const [isContentLoading, setIsContentLoading] = useState(false);

  const isMobile = useIsMobile();
  const { user, setUser } = useAuth();

  const { data: disciplinesData } = useDisciplines();
  const disciplines = useMemo(() => disciplinesData || [], [disciplinesData]);

  const discipline = disciplines.find((d) => d.id === config.disciplineId);
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

  // --- Handlers ---

  const handleStart = () => {
    setViewMode("quiz");
  };

  const handleStartLesson = () => {
    setViewMode("lesson");
  };

  const handleReset = (level: "all" | "discipline") => {
    if (level === "all") {
      setConfig((prev) => ({ ...prev, disciplineId: null, contentId: null }));
    } else {
      setConfig((prev) => ({ ...prev, contentId: null }));
      setHasContentSelected(false);
    }
    setViewMode("selection");
  };

  const handleToggleContentOptions = () => {
    setIsContentOptionsVisible((prev) => !prev);
  };

  const handleSelectDiscipline = (id: string) => {
    const isSame = id === config.disciplineId;
    setConfig({
      ...config,
      disciplineId: isSame ? null : id,
      contentId: null,
    });
    setIsContentLoading(true);
    setHasContentSelected(false);
    setIsContentOptionsVisible(true);
  };

  const handleSelectContent = (contentId: string) => {
    setConfig({ ...config, contentId });
    setHasContentSelected(true);
    setIsContentOptionsVisible(false);
  };

  const handleLessonChange = (newLessonId: string) => {
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
    netlifyIdentity.logout();
    if (isLocalhost) {
      setUser(null);
    }
  };

  const handleConfigChange = (partial: Partial<QuizConfig>) => {
    setConfig((prev) => ({ ...prev, ...partial }));
  };

  return {
    // state
    config,
    viewMode,
    hasContentSelected,
    isContentOptionsVisible,
    isContentLoading,
    isMobile,
    user,
    // data
    disciplines,
    selectedDiscipline,
    disciplineName,
    contents,
    content,
    lessons: lessonsData || [],
    lesson,
    quiz,
    sectionEnabled,

    // handlers
    handleStart,
    handleStartLesson,
    handleReset,
    handleToggleContentOptions,
    handleSelectDiscipline,
    handleSelectContent,
    handleLessonChange,
    handleLessonOrderChange,
    handleLogout,
    handleConfigChange,
    setIsContentLoading,
  };
}
