// components/ui/Select.tsx
import { AlertCircle, Check, ChevronDown } from "lucide-react";
import { forwardRef, useEffect, useRef, useState, type ReactNode } from "react";

export interface SelectOption {
  value: string;
  label: string;
  icon?: ReactNode;
  description?: string;
}

interface SelectProps {
  label?: string;
  options: SelectOption[] | string[];
  error?: string;
  hint?: string;
  containerClassName?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  name?: string;
  id?: string;
}

export const Select = forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      label,
      options,
      error,
      hint,
      containerClassName = "",
      placeholder = "Selecione uma opção",
      required,
      disabled = false,
      value: controlledValue,
      defaultValue,
      onChange,
      onBlur,
      name,
      id,
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [internalValue, setInternalValue] = useState(defaultValue || "");
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Converte string[] para SelectOption[] se necessário
    const normalizedOptions: SelectOption[] = options.map((opt) =>
      typeof opt === "string" ? { value: opt, label: opt } : opt,
    );

    // Determina o valor atual (controlado ou não)
    const currentValue =
      controlledValue !== undefined ? controlledValue : internalValue;

    // Encontra a opção selecionada
    const selectedOption = normalizedOptions.find(
      (opt) => opt.value === currentValue,
    );

    // Fecha o dropdown ao clicar fora
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
          onBlur?.();
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, [onBlur]);

    // Fecha ao pressionar ESC
    useEffect(() => {
      const handleEsc = (event: KeyboardEvent) => {
        if (event.key === "Escape" && isOpen) {
          setIsOpen(false);
          buttonRef.current?.focus();
        }
      };
      document.addEventListener("keydown", handleEsc);
      return () => document.removeEventListener("keydown", handleEsc);
    }, [isOpen]);

    const selectId = id || label?.toLowerCase().replace(/\s/g, "-");

    const handleSelect = (value: string) => {
      if (controlledValue === undefined) {
        setInternalValue(value);
      }
      onChange?.(value);
      setIsOpen(false);
      buttonRef.current?.focus();
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (disabled) return;

      switch (event.key) {
        case "Enter":
        case " ":
        case "ArrowDown":
          event.preventDefault();
          setIsOpen(true);
          break;
        case "ArrowUp":
          event.preventDefault();
          setIsOpen(true);
          break;
        case "Escape":
          setIsOpen(false);
          buttonRef.current?.focus();
          break;
      }
    };

    return (
      <div className={`flex flex-col gap-1.5 ${containerClassName}`} ref={ref}>
        {/* Label */}
        {label && (
          <label
            htmlFor={selectId}
            className="text-sm font-medium text-gray-700"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Input escondido para compatibilidade com formulários */}
        {name && <input type="hidden" name={name} value={currentValue || ""} />}

        {/* Container do dropdown */}
        <div className="relative" ref={dropdownRef}>
          {/* Botão do select */}
          <button
            id={selectId}
            ref={buttonRef}
            type="button"
            disabled={disabled}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            onKeyDown={handleKeyDown}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-invalid={!!error}
            aria-describedby={
              error
                ? `${selectId}-error`
                : hint
                  ? `${selectId}-hint`
                  : undefined
            }
            className={`
              w-full flex items-center justify-between
              rounded-lg border bg-white px-4 py-2.5
              text-gray-900
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-blue-500 hover:cursor-pointer hover:border-blue-400
              disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500
              ${error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-blue-500"}
              ${isOpen ? "ring-2 ring-blue-500 border-blue-500" : ""}
            `}
          >
            <span
              className={`flex items-center justify-center gap-1 ${!selectedOption ? "text-gray-400" : "text-gray-900"}`}
            >
              <span className="shrink-0 text-gray-400">
                {selectedOption?.icon && selectedOption?.icon}
              </span>
              {selectedOption?.label || placeholder}
            </span>
            <ChevronDown
              size={18}
              className={`text-gray-400 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
              strokeWidth={1.5}
            />
          </button>

          {/* Dropdown menu */}
          {isOpen && !disabled && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-100">
              <ul
                className="max-h-60 overflow-y-auto py-1"
                role="listbox"
                aria-labelledby={selectId}
              >
                {normalizedOptions.map((option, index) => (
                  <li key={option.value}>
                    <button
                      type="button"
                      onClick={() => handleSelect(option.value)}
                      className={`
                        w-full flex items-center gap-3 px-4 py-2.5 text-left hover:cursor-pointer
                        transition-colors duration-150
                        hover:bg-blue-50
                        ${currentValue === option.value ? "bg-blue-50 text-blue-700" : "text-gray-700"}
                        ${index !== normalizedOptions.length - 1 ? "border-b border-gray-100" : ""}
                      `}
                      role="option"
                      aria-selected={currentValue === option.value}
                    >
                      {/* Ícone opcional */}
                      {option.icon && (
                        <span className="shrink-0 text-gray-400">
                          {option.icon}
                        </span>
                      )}

                      {/* Label e descrição */}
                      <div className="flex-1">
                        <div
                          className={
                            currentValue === option.value ? "font-medium" : ""
                          }
                        >
                          {option.label}
                        </div>
                        {option.description && (
                          <div className="text-xs text-gray-400">
                            {option.description}
                          </div>
                        )}
                      </div>

                      {/* Checkmark da opção selecionada */}
                      {currentValue === option.value && (
                        <Check size={20} className="shrink-0 text-blue-500" />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Mensagem de erro ou hint */}
        {error && (
          <div
            className="flex items-center gap-1 text-sm text-red-500"
            id={`${selectId}-error`}
          >
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        )}
        {!error && hint && (
          <p className="text-xs text-gray-400" id={`${selectId}-hint`}>
            {hint}
          </p>
        )}
      </div>
    );
  },
);

Select.displayName = "Select";
