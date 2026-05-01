import { CheckCircle2, ChevronDown, Layers } from "lucide-react";
import { Spinner } from "./ui/Spinner";

interface Content {
  id: string;
  name: string;
  questions?: unknown[];
}

interface ContentSelectorProps {
  disciplineName: string;
  contents: Content[];
  selectedContentId: string | null;
  hasContentSelected: boolean;
  isContentOptionsVisible: boolean;
  isContentLoading: boolean;
  onSelectContent: (contentId: string) => void;
  onToggleContentOptions: () => void;
  onContentLoadComplete: () => void;
}

export function ContentSelector({
  disciplineName,
  contents,
  selectedContentId,
  hasContentSelected,
  isContentOptionsVisible,
  isContentLoading,
  onSelectContent,
  onToggleContentOptions,
  onContentLoadComplete,
}: ContentSelectorProps) {
  return (
    <section className="animate-in slide-in-from-top-4 duration-300">
      <div className="flex items-center gap-2 mb-4">
        <Layers size={20} className="text-blue-500" />
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
          Conteúdos de {disciplineName}
        </h2>
      </div>

      <div className="space-y-2">
        {contents.map((content) => {
          const isSelected = selectedContentId === content.id;
          const isHidden =
            !isSelected && hasContentSelected && !isContentOptionsVisible;

          return (
            <button
              key={content.id}
              onClick={() => onSelectContent(content.id)}
              className={`
                w-full flex items-center justify-between gap-2 p-4 rounded-xl border-2 transition-all hover:cursor-pointer
                ${
                  isSelected
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10"
                    : "border-transparent bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800"
                }
                ${isHidden ? "hidden" : "block"}
              `}
            >
              <div className="flex items-center gap-2">
                {isSelected && (
                  <CheckCircle2 size={18} className="text-blue-500" />
                )}
                <span
                  className={`font-medium ${
                    isSelected
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-slate-600 dark:text-slate-400"
                  }`}
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

        {contents.length === 0 &&
          (isContentLoading ? (
            <Spinner onComplete={onContentLoadComplete} />
          ) : (
            <span>Nenhum conteúdo disponível</span>
          ))}

        {hasContentSelected && (
          <div className="flex items-center justify-center gap-2 mb-4">
            <button
              onClick={onToggleContentOptions}
              className="text-blue-600 hover:text-blue-700 flex gap-2 items-center p-2 px-4 transition-colors font-medium hover:cursor-pointer"
            >
              <ChevronDown
                size={20}
                className={isContentOptionsVisible ? "rotate-180" : ""}
              />
              <span>
                {isContentOptionsVisible
                  ? "Esconder conteúdos"
                  : "Ver conteúdos"}
              </span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
