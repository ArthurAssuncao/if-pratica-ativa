import { BookOpen } from "lucide-react";
import type { Lesson } from "types/lesson";

interface SidebarSumarioProps {
  lessons: Lesson[];
  handleLessonChange: (lessonId: string) => void;
}

export const SidebarSumario = ({
  lessons,
  handleLessonChange,
}: SidebarSumarioProps) => {
  return (
    <>
      <div className="mx-2 pb-2 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
        <BookOpen size={20} className="text-blue-500" />
        <span>Sumário</span>
      </div>
      <nav className="flex-1 overflow-y-auto p-2 pt-0 pb-4 flex flex-col gap-2">
        {lessons.map((l) => (
          <button
            key={l.id}
            onClick={() => handleLessonChange(l.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all bg-blue-500 text-white shadow-lg shadow-blue-500/20 hover:cursor-pointer hover:bg-blue-600`}
          >
            <span className="opacity-90">{l.order}.</span>
            <span className="truncate">{l.title}</span>
          </button>
        ))}
      </nav>
    </>
  );
};
