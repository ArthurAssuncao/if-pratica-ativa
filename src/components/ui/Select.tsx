import { ChevronDown, LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Option {
  label: string;
  value: string;
}

interface SelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  // Novas props para o modo ícone fixo
  label: string;
  onlyTextIcon?: boolean;
  icon?: LucideIcon;
}

export const Select = ({
  options,
  value,
  onChange,
  placeholder,
  onlyTextIcon,
  icon,
  label,
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);
  const Icon = icon;

  return (
    <div className={``} ref={dropdownRef}>
      {/* Container Principal (Trigger) */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`
          ${onlyTextIcon && !isOpen ? "w-fit" : "w-full"} flex items-center justify-between p-3 rounded-lg border-2 transition-all duration-200
          hover:cursor-pointer shadow-sm group
          bg-olive-50 dark:bg-slate-900 border-olive-300 dark:border-slate-600
          ${isOpen ? "ring-2 ring-olive-400 dark:ring-blue-500/50 border-transparent" : ""}
        `}
      >
        <div className="flex items-center gap-2 overflow-hidden min-w-18">
          {/* Se onlyTextIcon existir, renderiza o ícone e label fixos */}
          {onlyTextIcon && Icon ? (
            <>
              <Icon
                size={18}
                className="text-olive-500 dark:text-blue-400 shrink-0"
              />
              <span className="lg:text-sm font-bold text-slate-700 dark:text-blue-300">
                {label}
              </span>
            </>
          ) : (
            /* Caso contrário, renderiza a opção selecionada ou placeholder */
            <span className="lg:text-sm font-medium text-slate-700 dark:text-blue-300 truncate">
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          )}
        </div>

        <ChevronDown
          size={18}
          className={`transition-transform duration-300 text-olive-500 dark:text-slate-400 shrink-0
            ${isOpen ? "rotate-180" : "rotate-0"}`}
        />
      </div>

      {/* Lista de Opções (Dropdown) */}
      {isOpen && (
        <div
          className="absolute z-50 w-full left-0 min-w-60 mt-2 rounded-lg border-2 shadow-xl animate-in fade-in zoom-in-95 duration-200
          text-slate-700 dark:text-blue-300 border-olive-400 dark:border-slate-700 bg-yellow-50 dark:bg-slate-800"
        >
          <div className="p-1 max-h-60 overflow-auto scrollbar-thin scrollbar-thumb-olive-300 dark:scrollbar-thumb-slate-600">
            {options.map((option) => (
              <div
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`
                  px-4 py-2.5 rounded-lg lg:text-sm transition-colors cursor-pointer mb-1 last:mb-0
                  ${
                    value === option.value
                      ? "bg-olive-200/50 dark:bg-blue-500/20 font-bold"
                      : "hover:bg-olive-100 dark:hover:bg-slate-700"
                  }
                `}
              >
                {option.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
