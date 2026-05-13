import { useState } from "react";
import { LUCIDE_ICONS } from "../../constants/icons";
import { lucidIconNameToIconComponent } from "../../util/icons";

export const DisciplineEditor = () => {
  const [selectedIcon, setSelectedIcon] = useState("Book");
  const iconNames = LUCIDE_ICONS;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <label className="block text-sm font-bold text-slate-400 uppercase">
            Nome da Disciplina
          </label>
          <input
            type="text"
            className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: Algoritmos I"
          />

          <label className="block text-sm font-bold text-slate-400 uppercase">
            Ícone Selecionado
          </label>
          <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
            {lucidIconNameToIconComponent(selectedIcon, 32, "text-blue-600")}

            <span className="font-mono text-sm">{selectedIcon}</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-400 uppercase mb-4">
            Escolha um Ícone
          </label>
          <div className="grid grid-cols-5 gap-2 h-64 overflow-y-auto p-2 border border-slate-100 dark:border-slate-800 rounded-xl">
            {iconNames.map((name) => (
              <button
                key={name}
                onClick={() => setSelectedIcon(name)}
                className={`p-3 rounded-lg flex items-center justify-center transition-all ${selectedIcon === name ? "bg-blue-600 text-white" : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"}`}
              >
                {lucidIconNameToIconComponent(name, 20)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
