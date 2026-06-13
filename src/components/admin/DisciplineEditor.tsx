import { useVirtualizer } from "@tanstack/react-virtual";
import { Plus } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import { ICONIFY_DATA_FILTERED } from "../../data/iconify-data-filtered";
import {
  ICONIFY_ICONS_SET,
  type IconifyCategories,
} from "../../data/iconify_data/iconify-icons-set";
import { disciplineService } from "../../service/disciplineService";
import type { Discipline } from "../../types/study";
import { iconifyIconNameToIconComponent } from "../../util/iconify-icons";
import { Input } from "../ui/Input";

const COLLECTIONS = Object.keys(ICONIFY_ICONS_SET) as string[];

// Função para extrair a lista de ícones de uma coleção
const getIconsList = (collection: {
  uncategorized?: string[];
  categories?: IconifyCategories;
}): string[] => {
  if (!collection) return [];

  const allIcons: string[] = [];

  // Adiciona ícones não categorizados
  if (Array.isArray(collection.uncategorized)) {
    allIcons.push(...collection.uncategorized);
  }

  // Adiciona ícones de todas as categorias
  if (collection.categories) {
    for (const category in collection.categories) {
      const icons = collection.categories[category as keyof IconifyCategories];
      if (Array.isArray(icons)) {
        allIcons.push(...icons);
      }
    }
  }

  const uniqueIcons = [...new Set(allIcons)];

  return uniqueIcons;
};

const IconButton = ({
  name,
  prefix,
  isSelected,
  onSelect,
}: {
  name: string;
  prefix: string;
  isSelected: boolean;
  onSelect: () => void;
}) => {
  const [tooltip, setTooltip] = useState<{ x: number; y: number } | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleMouseEnter = () => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    setTooltip({
      x: rect.left + rect.width / 2,
      y: rect.top - 8,
    });
  };

  const iconFullName = `${prefix}:${name}`;

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
            : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
        }`}
      >
        {iconifyIconNameToIconComponent(iconFullName, 20)}
      </button>

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
            className="text-xs text-white bg-slate-700 px-2 py-1 rounded-lg whitespace-nowrap shadow-md font-mono"
          >
            {iconFullName}
          </span>,
          document.body,
        )}
    </>
  );
};

const COLUMNS = 9;
const ROW_HEIGHT = 56;

// Componente de abas
const TabBar = ({
  activeTab,
  onTabChange,
  collections,
  iconsCount,
}: {
  activeTab: string;
  onTabChange: (tab: string) => void;
  collections: string[];
  iconsCount: Record<string, number>;
}) => {
  return (
    <div className="flex gap-2 border-slate-200 dark:border-slate-700 mb-4 flex-wrap pb-1">
      <button
        onClick={() => onTabChange("all")}
        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap hover:cursor-pointer ${
          activeTab === "all"
            ? "bg-blue-600 text-white"
            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
        }`}
      >
        Todos ({Object.values(iconsCount).reduce((a, b) => a + b, 0)})
      </button>
      {collections.map((collection, index) => (
        <button
          key={`${collection}-${index}`}
          onClick={() => onTabChange(collection)}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap capitalize hover:cursor-pointer ${
            activeTab === collection
              ? "bg-blue-600 text-white"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
          }`}
        >
          {ICONIFY_DATA_FILTERED[collection].name} (
          {iconsCount[collection] || 0})
        </button>
      ))}
    </div>
  );
};

export const DisciplineEditor = () => {
  const [selectedIcon, setSelectedIcon] = useState<{
    prefix: string;
    name: string;
  }>({
    prefix: "mdi",
    name: "home",
  });
  const [searchValue, setSearchValue] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [discipline, setDiscipline] = useState({} as Discipline);
  const parentRef = useRef<HTMLDivElement>(null);

  // Pré-calcular a lista de ícones por coleção
  const collectionIconsMap = useMemo(() => {
    const map: Record<string, string[]> = {};
    for (const collection of COLLECTIONS) {
      const data = ICONIFY_ICONS_SET[collection];
      map[collection] = getIconsList(data);
    }
    return map;
  }, []);

  // Contagem de ícones por coleção
  const iconsCount = useMemo(() => {
    const count: Record<string, number> = {};
    for (const collection of COLLECTIONS) {
      count[collection] = collectionIconsMap[collection]?.length || 0;
    }
    return count;
  }, [collectionIconsMap]);

  // Obter todos os ícones de todas as coleções (para a aba "Todos")
  const allIcons = useMemo(() => {
    const icons: Array<{ prefix: string; name: string; fullName: string }> = [];
    for (const collection of COLLECTIONS) {
      const iconsList = collectionIconsMap[collection] || [];
      for (const iconName of iconsList) {
        icons.push({
          prefix: collection,
          name: iconName,
          fullName: `${collection}:${iconName}`,
        });
      }
    }
    return icons;
  }, [collectionIconsMap]);

  // Filtrar ícones baseado na aba ativa e busca
  const filteredIcons = useMemo(() => {
    let icons: Array<{ prefix: string; name: string; fullName: string }> = [];

    if (activeTab === "all") {
      icons = [...allIcons];
    } else {
      const iconsList = collectionIconsMap[activeTab] || [];
      icons = iconsList.map((iconName: string) => ({
        prefix: activeTab,
        name: iconName,
        fullName: `${activeTab}:${iconName}`,
      }));
    }

    if (searchValue.trim()) {
      const searchLower = searchValue.toLowerCase();
      icons = icons.filter(
        (icon) =>
          icon.name.toLowerCase().includes(searchLower) ||
          icon.fullName.toLowerCase().includes(searchLower),
      );
    }

    return icons;
  }, [activeTab, searchValue, allIcons, collectionIconsMap]);

  // Agrupa os ícones em linhas de COLUMNS itens cada
  const rows = useMemo(() => {
    const result: Array<
      Array<{ prefix: string; name: string; fullName: string }>
    > = [];
    for (let i = 0; i < filteredIcons.length; i += COLUMNS) {
      result.push(filteredIcons.slice(i, i + COLUMNS));
    }
    return result;
  }, [filteredIcons]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 3,
  });

  const selectedIconFullName = `${selectedIcon.prefix}:${selectedIcon.name}`;

  const handleClick = async () => {
    if (!discipline.name) {
      toast.error("Por favor, insira o nome da disciplina");
      return;
    }

    const disciplineResponse =
      await disciplineService.createDiscipline(discipline);
    if (disciplineResponse.id && disciplineResponse.created_at) {
      toast.success(
        `Disciplina ${discipline.name} com ícone ${selectedIconFullName} criada com sucesso`,
      );
    }
  };

  return (
    <div>
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black dark:text-white capitalize">
            Disciplina
          </h1>
          <p className="text-slate-500 text-sm"></p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all hover:cursor-pointer"
          onClick={handleClick}
        >
          <Plus size={16} /> Cadastrar Disciplina
        </button>
      </header>
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm gap-4 flex flex-col">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Coluna da esquerda - Informações da disciplina */}
          <div className="flex flex-col gap-2">
            <label className="block text-sm font-bold text-slate-400 uppercase">
              Nome da Disciplina
            </label>
            <div>
              <Input
                type="text"
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800"
                placeholder="Ex: Algoritmos I"
                value={discipline.name}
                onChange={(ev) => {
                  setDiscipline({
                    ...discipline,
                    id: ev.target.value.toLowerCase().replace(/\s/g, "-"),
                    name: ev.target.value,
                  });
                }}
              />
            </div>
            <div>
              {discipline.id ? (
                <span className="bg-slate-50 dark:bg-slate-800 rounded-xl flex px-4 py-2 text-sm text-slate-700 dark:text-slate-300">
                  ID: {discipline.id}
                </span>
              ) : (
                <span>&nbsp;</span>
              )}
            </div>
          </div>

          {/* Coluna da direita - Seletor de ícones */}
          <div className="flex flex-col gap-2">
            <label className="block text-sm font-bold text-slate-400 uppercase">
              Ícone Selecionado
            </label>
            <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
              {iconifyIconNameToIconComponent(
                selectedIconFullName,
                50,
                "text-blue-600",
              )}
              <span className="font-mono text-sm">{selectedIconFullName}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="block text-sm font-bold text-slate-400 uppercase">
            Escolha um Ícone
          </label>

          {/* Busca */}
          <div>
            <Input
              type="search"
              placeholder="Buscar ícone..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>

          {/* Abas */}
          <TabBar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            collections={COLLECTIONS as unknown as string[]}
            iconsCount={iconsCount}
          />

          {/* Container com scroll */}
          <div
            ref={parentRef}
            className="h-100 overflow-y-auto p-2 border border-slate-100 dark:border-slate-800 rounded-xl "
          >
            {virtualizer.getTotalSize() === 0 && filteredIcons.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                🔍 Nenhum ícone encontrado.
              </div>
            )}
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
                    {rows[virtualRow.index]?.map((icon) => (
                      <IconButton
                        key={`${icon.fullName}`}
                        name={icon.name}
                        prefix={icon.prefix}
                        isSelected={selectedIconFullName === icon.fullName}
                        onSelect={() => {
                          setSelectedIcon({
                            prefix: icon.prefix,
                            name: icon.name,
                          });
                          setDiscipline({
                            ...discipline,
                            iconSlug: icon.fullName,
                          });
                        }}
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
