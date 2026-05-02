interface ProgressBarProps {
  completed: number;
  total: number;
  className?: string;
}

export const ProgressBar = ({
  completed,
  total,
  className,
}: ProgressBarProps) => {
  const percentage = (completed / total) * 100;
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between text-sm">
        <span className="text-slate-600 dark:text-slate-300 font-medium">
          Progresso
        </span>
        <span className="text-blue-600 dark:text-blue-400 font-bold">
          {completed}/{total}
        </span>
      </div>
      <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
