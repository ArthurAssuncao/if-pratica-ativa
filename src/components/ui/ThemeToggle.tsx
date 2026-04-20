import { useTheme } from "hook/useTheme";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex gap-2 p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
      <button
        onClick={() => setTheme("light")}
        className={`px-3 py-1 rounded flex gap-1 items-center justify-center ${theme === "light" ? "bg-white shadow" : ""}`}
      >
        <span>☀️</span>
        <span className="text-slate-700 dark:text-slate-200 hidden md:inline-flex">
          Light
        </span>
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`px-3 py-1 rounded flex gap-1 items-center justify-center ${theme === "dark" ? "bg-slate-700 text-white" : ""}`}
      >
        <span>🌙</span>
        <span className="text-slate-700 dark:text-slate-200 hidden md:inline-flex">
          Dark
        </span>
      </button>
      <button
        onClick={() => setTheme("system")}
        className={`px-3 py-1 rounded flex gap-1 items-center justify-center ${theme === "system" ? "bg-blue-500 text-white" : ""}`}
      >
        <span className="hidden md:inline-flex">💻</span>
        <span className="md:hidden inline-flex">📱</span>
        <span className="text-slate-700 dark:text-slate-200 hidden md:inline-flex">
          Sistema
        </span>
      </button>
    </div>
  );
}
