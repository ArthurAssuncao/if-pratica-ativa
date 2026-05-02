export const UserStat = ({
  title,
  value,
}: {
  title: string | React.ReactNode;
  value: number | string;
  icon: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col min-h-20 min-w-20 p-3 lg:p-2 xl:p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 items-center justify-center">
      <div className="flex items-center gap-2 mb-1">
        {/* {icon} */}
        <span className="text-[10px] text-slate-500 uppercase font-bold flex flex-col items-center justify-center">
          {title}
        </span>
      </div>
      <span className="text-lg font-bold text-slate-800 dark:text-slate-100">
        {value}
      </span>
    </div>
  );
};
