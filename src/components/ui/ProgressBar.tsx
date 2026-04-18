export const ProgressBar = ({
  atual,
  total,
}: {
  atual: number;
  total: number;
}) => (
  <div
    className="fixed top-0 left-0 h-1 bg-green-500 dark:bg-green-500 transition-all duration-500 rounded-2xl z-99"
    style={{ width: `${((atual + 1) / total) * 100}%` }}
  />
);
