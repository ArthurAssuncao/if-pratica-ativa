import { useTheme } from "hook/useTheme";
import { ChevronDown } from "lucide-react"; // Opcional: para o ícone de seta
import { useState } from "react";

interface Theme {
  id: "light" | "dark" | "system";
  label: string;
  icon: string;
  iconMobile?: string;
  color: string;
}

interface ThemeProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeProps) {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themes: Theme[] = [
    {
      id: "light",
      label: "Claro",
      icon: "☀️",
      color: "bg-white shadow dark:bg-slate-700",
    },
    { id: "dark", label: "Dark", icon: "🌙", color: "bg-slate-700 text-white" },
    {
      id: "system",
      label: "Sistema",
      icon: "💻",
      iconMobile: "📱",
      color: "bg-blue-500 text-white",
    },
  ];

  const currentTheme = themes.find((t) => t.id === theme) || themes[2];

  return (
    <div className={`relative ${className}`}>
      {/* --- VERSÃO MOBILE (Dropdown) --- */}
      <div className="md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 p-2 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:cursor-pointer"
        >
          <span>{theme === "system" ? "📱" : currentTheme.icon}</span>
          <span className="text-sm font-medium dark:text-white capitalize">
            {currentTheme.label}
          </span>
          <ChevronDown
            size={16}
            className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isOpen && (
          <>
            {/* Overlay para fechar ao clicar fora */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />

            <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-lg shadow-xl z-20 overflow-hidden">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setTheme(t.id);
                    setIsOpen(false);
                  }}
                  className={`flex items-center gap-3 w-full px-4 py-3 text-sm transition-colors ${
                    theme === t.id
                      ? "bg-slate-100 dark:bg-slate-700 font-bold"
                      : "hover:bg-slate-50 dark:hover:bg-slate-700/50"
                  }`}
                >
                  <span>{t.id === "system" ? "📱" : t.icon}</span>
                  <span className="dark:text-slate-200">{t.label}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* --- VERSÃO DESKTOP (Botões lado a lado) --- */}
      <div className="hidden md:flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg border border-indigo-200 dark:border-slate-700">
        {themes.map((t) => (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            className={`px-3 py-1.5 rounded-lg flex gap-2 items-center transition-all text-sm font-medium hover:cursor-pointer border border-transparent  ${
              theme === t.id
                ? `${t.color} shadow-sm`
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-slate-200"
            }`}
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
