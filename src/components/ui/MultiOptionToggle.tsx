import { type ReactNode } from "react";
import type { QuestionType } from "../../types/study";
import { getTipoQuestaoPorExtenso, TIPOS_QUESTAO } from "../../util/Quiz";

interface MultiOptionToggleProps<T> {
  options: T[];
  selectedValues: T[]; // Agora recebe um array
  disabled?: boolean;
  allOptionValue: T; // Valor que representa "Todos"
  exclude?: T[];
  onChange: (values: T[]) => void;
  renderOption?: (option: T) => ReactNode;
  className?: string;
}

export function MultiOptionToggle<T>({
  options,
  selectedValues,
  disabled,
  allOptionValue,
  exclude,
  onChange,
  renderOption,
  className = "",
}: MultiOptionToggleProps<T>) {
  const handleToggle = (option: T) => {
    if (disabled) return;

    // Se clicar em "Todos"
    if (option === allOptionValue) {
      const isAllSelected = selectedValues.length === options.length;
      // Se já estava tudo marcado, desmarca tudo (ou mantém apenas 'Todos', conforme preferência)
      // Aqui vamos seguir a lógica: se clicar em todos, marca o array inteiro
      onChange(isAllSelected ? [allOptionValue] : [...options]);
      return;
    }

    let newSelected: T[];

    if (selectedValues.includes(option)) {
      // Remover a opção e também remover o "Todos" se ele estiver presente
      newSelected = selectedValues.filter(
        (v) => v !== option && v !== allOptionValue,
      );
    } else {
      // Adicionar a opção
      newSelected = [...selectedValues, option];

      // Se após adicionar, todas as outras opções (exceto 'Todos') estiverem marcadas,
      // adicionamos o 'Todos' automaticamente
      const otherOptions = options.filter((opt) => opt !== allOptionValue);
      const allOthersSelected = otherOptions.every((opt) =>
        newSelected.includes(opt),
      );

      if (allOthersSelected && !newSelected.includes(allOptionValue)) {
        newSelected.push(allOptionValue);
      }
    }

    onChange(newSelected);
  };

  return (
    <div
      className={`relative grid grid-cols-2 md:grid-cols-4 lg:grid-cols-1 xl:grid-cols-3 gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 ${className}`}
    >
      {options
        .filter((opt) => !exclude?.includes(opt))
        .map((option) => {
          const isActive = selectedValues.includes(option);

          let optionText = String(option);
          if ((TIPOS_QUESTAO as string[]).includes(String(option))) {
            optionText = getTipoQuestaoPorExtenso(
              String(option) as QuestionType,
            );
          }

          return (
            <button
              key={String(option)}
              onClick={() => handleToggle(option)}
              type="button"
              className={`
              relative  p-1 z-10 py-2 text-sm font-bold rounded-xl transition-all duration-200 flex items-start justify-center gap-2 hover:cursor-pointer
              ${
                isActive || selectedValues.includes(allOptionValue)
                  ? "bg-white dark:bg-blue-600 shadow-sm text-blue-600 dark:text-white border-2 border-blue-500 hover:bg-slate-200 dark:hover:bg-blue-800 hover:border-blue-600 dark:hover:border-blue-800"
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 border-2 border-blue-100 dark:border-blue-950 hover:border-blue-500 dark:hover:border-blue-500"
              }
              ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
            `}
            >
              {renderOption ? renderOption(option) : optionText}
            </button>
          );
        })}
    </div>
  );
}
