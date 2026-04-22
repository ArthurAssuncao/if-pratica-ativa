import { Discipline } from "types/study";

interface DisciplineCardProps {
  discipline: Discipline;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export function DisciplineCard({
  discipline,
  isSelected,
  onSelect,
}: DisciplineCardProps) {
  return (
    <button
      onClick={() => onSelect(discipline.id)}
      className={`
        flex flex-row md:flex-col gap-2 items-center justify-start md:justify-center p-4 rounded-2xl border-2 
        transition-all duration-200 cursor-pointer w-full
        ${
          isSelected
            ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 ring-2 ring-blue-200 dark:ring-blue-500/20"
            : "border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400"
        }
      `}
    >
      <span className="text-5xl md:text-4xl mb-2">{discipline.icon}</span>
      <span className="font-bold text-sm text-center leading-tight">
        {discipline.name}
      </span>
    </button>
  );
}
