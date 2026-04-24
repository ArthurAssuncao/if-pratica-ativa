import { ChevronRight, Clock, Play } from "lucide-react";
import { SavedProgress } from "types/study";

export const ContinueCard = ({
  progress,
  onContinue,
}: {
  progress: SavedProgress;
  onContinue: () => void;
}) => (
  <div className="group cursor-pointer" onClick={onContinue}>
    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider  hidden md:visible">
      Continuar de onde parei
    </h3>
    <div className="flex flex-row items-center gap-4 px-10 md:px-6 p-6 rounded-2xl bg-linear-to-br from-blue-600 to-indigo-700 text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
      <div className="bg-white/20 p-2 md:p-4 rounded-xl text-lg md:text-3xl hidden md:visible">
        <Clock className="" />
      </div>
      <div className="flex-1 items-start text-left">
        <div className="flex flex-wrap justify-start items-center gap-2 mb-1">
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
      <button className="flex items-center gap-2 bg-white text-blue-700 px-4 py-4 md:px-6 md:py-3 rounded-xl font-bold shadow-lg group-hover:bg-blue-50 transition-colors">
        <span className="hidden md:block">Retomar</span>
        <Play size={18} fill="currentColor" />
      </button>
    </div>
  </div>
);
