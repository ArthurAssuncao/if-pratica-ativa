import { Book, Play } from "lucide-react";

interface StudyMaterialSectionProps {
  sectionEnabled: boolean;
  onStartLesson: () => void;
}

export function StudyMaterialSection({
  sectionEnabled,
  onStartLesson,
}: StudyMaterialSectionProps) {
  return (
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
        onClick={onStartLesson}
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
  );
}
