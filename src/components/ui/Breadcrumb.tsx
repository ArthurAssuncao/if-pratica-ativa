import { ChevronRight } from "lucide-react";
import { QuizConfig } from "types/quiz";

export const Breadcrumb = ({
  config,
  disciplineName,
  contentName,
  onReset,
}: {
  config: QuizConfig;
  onReset: (level: "all" | "discipline") => void;
  disciplineName: string;
  contentName: string;
}) => {
  return (
    <nav className="flex items-center gap-2 text-sm text-slate-500 overflow-x-auto whitespace-nowrap pb-2 flex-wrap">
      <button
        onClick={() => onReset("all")}
        className="hover:text-blue-600 transition-colors font-medium hover:cursor-pointer"
      >
        Todas disciplinas
      </button>
      {config.disciplineId && (
        <>
          <ChevronRight size={14} />
          <button
            onClick={() => onReset("discipline")}
            className="hover:text-blue-600 transition-colors font-medium text-slate-700 dark:text-slate-300 hover:cursor-pointer"
          >
            {disciplineName}
          </button>
        </>
      )}
      {config.contentId && (
        <>
          <ChevronRight size={14} />
          <span className="text-blue-600 font-bold">{contentName}</span>
        </>
      )}
    </nav>
  );
};
