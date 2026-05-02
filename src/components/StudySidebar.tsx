import { useIsMobile } from "hook/useIsMobile";
import type { ViewMode } from "hook/useStudyPage";
import type { Lesson } from "types/lesson";
import type { Discipline } from "types/study";
import { SidebarSumario } from "./lesson/SidebarSumario";
import { Sidebar } from "./ui/Sidebar";
import { ThemeToggle } from "./ui/ThemeToggle";
import { UserStatsCard } from "./ui/UserStatsCard";

interface StudySidebarProps {
  user: ReturnType<typeof import("hook/useAuth").useAuth>["user"];
  viewMode: ViewMode;
  discipline: Discipline | undefined;
  lesson: Lesson | undefined;
  lessons: Lesson[];

  onLessonChange: (lessonId: string) => void;
  onLogout: () => void;
}

interface StudyButtonLogoutProps {
  onLogout: () => void;
  className?: string;
}

export const StudyButtonLogout = ({
  onLogout,
  className,
}: StudyButtonLogoutProps) => {
  return (
    <button
      onClick={onLogout}
      className={`mt-2 text-xs bg-slate-200 text-slate-900 hover:text-red-700 transition-all rounded-2xl py-2 hover:cursor-pointer hover:shadow-md hover:shadow-slate-200 ${className}`}
    >
      Sair
    </button>
  );
};

export function StudySidebar({
  user,
  viewMode,
  discipline,
  lesson,
  lessons,

  onLessonChange,
  onLogout,
}: StudySidebarProps) {
  const isMobile = useIsMobile();

  return (
    <Sidebar className="self-stretch md:flex-1/3 lg:flex-1/3 w-3/4 md:w-1/3 p-0  animate-in fade-in duration-500 flex flex-col gap-4">
      <div className="h-full lg:rounded-2xl p-0 shadow border bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
        {user?.user_metadata?.full_name && (
          <div className="flex flex-col items-center justify-center gap-2 xl:gap-0 p-4 rounded-t-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
            <div className="flex flex-row items-center justify-center gap-6 ">
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
              </div>
            </div>
            <StudyButtonLogout onLogout={onLogout} className="min-w-44" />
          </div>
        )}

        <div className="flex flex-col gap-4 p-4">
          {viewMode === "lesson" && discipline && lesson && (
            <SidebarSumario
              lessons={lessons}
              handleLessonChange={onLessonChange}
            />
          )}
          <UserStatsCard discipline={discipline} />
        </div>
      </div>
    </Sidebar>
  );
}
