import { useVirtualizer } from "@tanstack/react-virtual";
import { useMemo, useRef, useState } from "react";
import { LUCIDE_ICONS } from "../../constants/icons";
import { lucidIconNameToIconComponent } from "../../util/icons";
import { Input } from "../ui/Input";

import { createPortal } from "react-dom";

const IconButton = ({
  name,
  isSelected,
  onSelect,
}: {
  name: string;
  isSelected: boolean;
  onSelect: () => void;
}) => {
  const [tooltip, setTooltip] = useState<{ x: number; y: number } | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleMouseEnter = () => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    setTooltip({
      x: rect.left + rect.width / 2, // centralizado no botão
      y: rect.top - 8, // acima do botão
    });
  };

  return (
    <>
      <button
        ref={btnRef}
        onClick={onSelect}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setTooltip(null)}
        className={`p-3 rounded-lg flex items-center justify-center transition-all hover:cursor-pointer ${
          isSelected
            ? "bg-blue-600 text-white"
            : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"
        }`}
      >
        {lucidIconNameToIconComponent(name, 20)}
      </button>

      {/* Renderiza o tooltip direto no body, fora de qualquer container */}
      {tooltip &&
        createPortal(
          <span
            style={{
              position: "fixed",
              left: tooltip.x,
              top: tooltip.y,
              transform: "translate(-50%, -100%)",
              pointerEvents: "none",
              zIndex: 9999,
            }}
            className="text-xs text-white bg-slate-700 px-2 py-1 rounded-lg whitespace-nowrap shadow-md"
          >
            {name}
          </span>,
          document.body,
        )}
    </>
  );
};

const COLUMNS = 5;
const ROW_HEIGHT = 56; // px — altura de cada linha do grid

export const DisciplineEditor = () => {
  "use no memo";
  const [selectedIcon, setSelectedIcon] = useState("Book");
  const [searchValue, setSearchValue] = useState("");
  const parentRef = useRef<HTMLDivElement>(null);

  const filteredIconNames = useMemo(
    () => LUCIDE_ICONS.filter((item) => item.includes(searchValue)),
    [searchValue],
  );

  // Agrupa os ícones em linhas de COLUMNS itens cada
  const rows = useMemo(() => {
    const result: string[][] = [];
    for (let i = 0; i < filteredIconNames.length; i += COLUMNS) {
      result.push(filteredIconNames.slice(i, i + COLUMNS));
    }
    return result;
  }, [filteredIconNames]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 3,
  });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <label className="block text-sm font-bold text-slate-400 uppercase">
            Nome da Disciplina
          </label>
          <Input
            type="text"
            className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 "
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

        <div className="flex flex-col gap-4">
          <label className="block text-sm font-bold text-slate-400 uppercase">
            Escolha um Ícone
          </label>
          <Input
            type="search"
            placeholder="Buscar ícone..."
            onChange={(e) => setSearchValue(e.target.value)}
          />

          {/* Container com scroll — ref obrigatória para o virtualizer */}
          <div
            ref={parentRef}
            className="h-100 overflow-y-auto p-2 border border-slate-100 dark:border-slate-800 rounded-xl"
          >
            {virtualizer.getTotalSize() == 0 && (
              <span className="text-center">Nenhum ícone encontrado.</span>
            )}
            {/* Div interna com a altura total real de todas as linhas */}
            {virtualizer.getTotalSize() > 0 && (
              <div
                style={{
                  height: virtualizer.getTotalSize(),
                  position: "relative",
                }}
              >
                {virtualizer.getVirtualItems().map((virtualRow) => (
                  <div
                    key={virtualRow.index}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                      display: "grid",
                      gridTemplateColumns: `repeat(${COLUMNS}, 1fr)`,
                      gap: "8px",
                      alignItems: "center",
                    }}
                  >
                    {rows[virtualRow.index].map((name) => (
                      <IconButton
                        key={name}
                        name={name}
                        isSelected={selectedIcon === name}
                        onSelect={() => setSelectedIcon(name)}
                      />
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
