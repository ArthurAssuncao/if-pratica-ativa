// components/ui/ListView.tsx
import { type ReactNode } from "react";

export interface ListItem {
  id: string | number;
  label: string;
  icon?: ReactNode;
  description?: string;
  badge?: string | number;
  disabled?: boolean;
  [key: string]: unknown; // Para dados extras
}

interface ListViewProps {
  title?: string;
  items: ListItem[];
  onItemClick?: (item: ListItem) => void;
  onItemDoubleClick?: (item: ListItem) => void;
  renderItem?: (item: ListItem) => ReactNode;
  emptyMessage?: string;
  loading?: boolean;
  loadingMessage?: string;
  className?: string;
  itemClassName?: string;
  selectedId?: string | number;
  variant?: "default" | "compact" | "large";
  showDividers?: boolean;
  hoverable?: boolean;
}

export const ListView = ({
  title,
  items,
  onItemClick,
  onItemDoubleClick,
  renderItem,
  emptyMessage = "Nenhum item encontrado",
  loading = false,
  loadingMessage = "Carregando...",
  className = "",
  itemClassName = "",
  selectedId,
  variant = "default",
  showDividers = true,
  hoverable = true,
}: ListViewProps) => {
  // Variantes de tamanho
  const variantClasses = {
    default: "p-3 gap-3",
    compact: "p-2 gap-2",
    large: "p-4 gap-4",
  };

  // Estilos do container
  const containerClasses = `
    bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800
    overflow-hidden ${className}
  `;

  // Estilos do item
  const getItemClasses = (item: ListItem) => {
    const isSelected = selectedId === item.id;
    const isDisabled = item.disabled;

    return `
      flex items-center w-full transition-colors duration-150
      ${variantClasses[variant]}
      ${showDividers ? "border-b border-gray-100 dark:border-gray-800 last:border-b-0" : ""}
      ${hoverable && !isDisabled ? "hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer" : ""}
      ${isSelected ? "bg-blue-50 dark:bg-blue-900/20" : ""}
      ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
      ${itemClassName}
    `;
  };

  // Renderização padrão do item
  const DefaultItem = ({ item }: { item: ListItem }) => (
    <div className="flex items-center flex-1 min-w-0">
      {/* Ícone */}
      {item.icon && (
        <div className="flex-shrink-0 mr-3 text-gray-500 dark:text-gray-400">
          {item.icon}
        </div>
      )}

      {/* Conteúdo principal */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span
            className={`font-medium truncate ${item.disabled ? "text-gray-400" : "text-gray-900 dark:text-white"}`}
          >
            {item.label}
          </span>

          {/* Badge */}
          {item.badge && (
            <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">
              {item.badge}
            </span>
          )}
        </div>

        {/* Descrição */}
        {item.description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-0.5">
            {item.description}
          </p>
        )}
      </div>
    </div>
  );

  // Estado de loading
  if (loading) {
    return (
      <div className={containerClasses}>
        {title && (
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
          </div>
        )}
        <div className="flex items-center justify-center p-8">
          <div className="flex flex-col items-center gap-2">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {loadingMessage}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Lista vazia
  if (items.length === 0) {
    return (
      <div className={containerClasses}>
        {title && (
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
          </div>
        )}
        <div className="flex items-center justify-center p-8">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {emptyMessage}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      {/* Título */}
      {title && (
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
        </div>
      )}

      {/* Lista de itens */}
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {items.map((item) => (
          <div
            key={item.id}
            className={getItemClasses(item)}
            onClick={() => !item.disabled && onItemClick?.(item)}
            onDoubleClick={() => !item.disabled && onItemDoubleClick?.(item)}
            role={onItemClick ? "button" : undefined}
            tabIndex={onItemClick && !item.disabled ? 0 : undefined}
          >
            {renderItem ? renderItem(item) : <DefaultItem item={item} />}
          </div>
        ))}
      </div>
    </div>
  );
};
