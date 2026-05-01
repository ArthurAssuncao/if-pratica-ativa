import { MOCK_PROGRESS, useStudyPage } from "hook/useStudyPage";
import { ContentSelector } from "./ContentSelector";
import { DisciplineSelector } from "./DisciplineSelector";
import { Textbook } from "./lesson/Textbook";
import Quiz from "./Quiz";
import { QuizConfigurator } from "./QuizConfigurator";
import { StudyMaterialSection } from "./StudyMaterialSection";
import { StudySidebar } from "./StudySidebar";
import { Breadcrumb } from "./ui/Breadcrumb";
import { ContinueCard } from "./ui/ContinueCard";

export default function StudySelectionPage() {
  const {
    config,
    viewMode,
    hasContentSelected,
    isContentOptionsVisible,
    isContentLoading,
    user,
    disciplines,
    selectedDiscipline,
    disciplineName,
    contents,
    content,
    lessons,
    lesson,
    quiz,
    sectionEnabled,
    generalStats,
    disciplineStats,
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
  } = useStudyPage();

  return (
    <div className="flex flex-row items-stretch">
      {/* Sidebar */}
      <StudySidebar
        user={user}
        viewMode={viewMode}
        selectedDiscipline={selectedDiscipline}
        lesson={lesson}
        lessons={lessons}
        generalStats={generalStats}
        disciplineStats={disciplineStats}
        onLessonChange={handleLessonChange}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="max-w-full p-4 md:p-8 animate-in fade-in duration-500 flex flex-col gap-4">
        {/* Continue Card */}
        {MOCK_PROGRESS && viewMode !== "quiz" && (
          <ContinueCard
            progress={MOCK_PROGRESS}
            onContinue={() => console.log("Continuando...", MOCK_PROGRESS)}
          />
        )}

        {/* Breadcrumb */}
        <Breadcrumb
          config={config}
          onReset={handleReset}
          disciplineName={disciplineName || ""}
          contentName={content?.name || ""}
        />

        {/* Lesson View */}
        {viewMode === "lesson" && selectedDiscipline && lesson && (
          <Textbook
            lesson={lesson}
            discipline={selectedDiscipline}
            onLessonChange={handleLessonOrderChange}
          />
        )}

        {/* Quiz View */}
        {viewMode === "quiz" && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm items-center justify-center">
            <Quiz quiz={quiz} />
          </div>
        )}

        {/* Selection View */}
        {viewMode === "selection" && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Left Column */}
              <div className="lg:col-span-7">
                <DisciplineSelector
                  disciplines={disciplines}
                  selectedDisciplineId={config.disciplineId}
                  onSelect={handleSelectDiscipline}
                />

                {selectedDiscipline && (
                  <ContentSelector
                    disciplineName={selectedDiscipline.name}
                    contents={contents}
                    selectedContentId={config.contentId}
                    hasContentSelected={hasContentSelected}
                    isContentOptionsVisible={isContentOptionsVisible}
                    isContentLoading={isContentLoading}
                    onSelectContent={handleSelectContent}
                    onToggleContentOptions={handleToggleContentOptions}
                    onContentLoadComplete={() => setIsContentLoading(false)}
                  />
                )}
              </div>

              {/* Right Column */}
              <div className="lg:col-span-5 space-y-8">
                <QuizConfigurator
                  config={config}
                  sectionEnabled={sectionEnabled}
                  onConfigChange={handleConfigChange}
                  onStart={handleStart}
                />

                {selectedDiscipline && lesson && (
                  <StudyMaterialSection
                    sectionEnabled={sectionEnabled}
                    onStartLesson={handleStartLesson}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
