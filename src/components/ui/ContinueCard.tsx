import { ChevronRight, Clock, Play } from "lucide-react";
import { SavedProgress } from "types/study";

export const ContinueCard = ({
  progress,
  onContinue,
}: {
  progress: SavedProgress;
  onContinue: () => void;
}) => (
  <div className="mb-8 group cursor-pointer" onClick={onContinue}>
    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 ml-1">
      Continuar de onde parei
    </h3>
    <div className="flex flex-col md:flex-row items-center gap-6 p-6 rounded-2xl bg-linear-to-br from-blue-600 to-indigo-700 text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
      <div className="bg-white/20 p-4 rounded-xl">
        <Clock size={32} />
      </div>
      <div className="flex-1 text-center md:text-left">
        <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 mb-1">
          <span className="bg-white/20 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-tight">
            {progress.disciplineName}
          </span>
          <ChevronRight size={14} className="opacity-60" />
          <span className="text-blue-100 font-medium">
            {progress.contentName}
          </span>
        </div>
        <p className="text-lg opacity-90">
          Você ainda tem{" "}
          <span className="font-bold">{progress.remaining} questões</span>{" "}
          pendentes nesta trilha.
        </p>
      </div>
      <button className="flex items-center gap-2 bg-white text-blue-700 px-6 py-3 rounded-xl font-bold shadow-lg group-hover:bg-blue-50 transition-colors">
        Retomar <Play size={18} fill="currentColor" />
      </button>
    </div>
  </div>
);
