export const HeaderProgressBar = ({
  completed,
  total,
}: {
  completed: number;
  total: number;
}) => {
  const percentage = (completed / total) * 100;
  return (
    <div
      className="fixed top-0 left-0 h-1 bg-green-500 dark:bg-green-500 transition-all duration-500 rounded-2xl z-99"
      style={{ width: `${percentage}%` }}
    />
  );
};
