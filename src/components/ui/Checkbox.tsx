// components/ui/Checkbox.tsx
import { Check } from "lucide-react";
import { forwardRef, type InputHTMLAttributes } from "react";
import { getExclusiveClasses } from "../../util/tailwind-util";

type CheckboxSize = "sm" | "md" | "lg" | "xl";

type CheckboxSizeClasses = {
  wrapper: string;
  icon: string;
  label: string;
  description: string;
};

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  error?: boolean;
  checkboxSize?: CheckboxSize;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      description,
      error = false,
      checkboxSize = "md",
      disabled,
      checked,
      className = "",
      id,
      name,
      ...props
    },
    ref,
  ) => {
    const checkboxId = id || label?.toLowerCase().replace(/\s/g, "-");

    // Classes de tamanho
    const checkboxSizeClasses: Record<CheckboxSize, CheckboxSizeClasses> = {
      sm: {
        wrapper: "w-4 h-4",
        icon: "w-3 h-3",
        label: "text-sm",
        description: "text-xs",
      },
      md: {
        wrapper: "w-5 h-5",
        icon: "w-3.5 h-3.5",
        label: "text-base",
        description: "text-sm",
      },
      lg: {
        wrapper: "w-6 h-6",
        icon: "w-4 h-4",
        label: "text-lg",
        description: "text-sm",
      },
      xl: {
        wrapper: "w-8 h-8",
        icon: "w-6 h-6",
        label: "text-lg",
        description: "text-sm",
      },
    };

    const currentSize = checkboxSizeClasses[checkboxSize];

    const classInput = `inline-flex items-start gap-3  transition-opacity duration-200`;
    const classInputFiltered = getExclusiveClasses(classInput, className);

    const roundedClasses: Record<CheckboxSize, string> = {
      sm: "rounded",
      md: "rounded-md",
      lg: "rounded-lg",
      xl: "rounded-lg",
    };

    return (
      <label
        htmlFor={checkboxId}
        className={`
          ${classInputFiltered}
          ${disabled ? "opacity-50 cursor-not-allowed" : "hover:opacity-80"}

          ${className}
        `}
      >
        {/* Checkbox customizado */}
        <div className="relative shrink-0 mt-0.5">
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            name={name}
            disabled={disabled}
            checked={checked}
            className="sr-only"
            {...props}
          />

          {/* Quadrado do checkbox */}
          <div
            className={`
              ${currentSize.wrapper}
              ${roundedClasses[checkboxSize]} border-2 transition-all duration-200
              flex items-center justify-center
              ${
                checked
                  ? "bg-blue-500 border-blue-500"
                  : "bg-white border-gray-300"
              }
              ${!disabled && "group-hover:border-gray-400 hover:border-blue-500 cursor-pointer"}
              ${disabled && "bg-slate-300"}
              ${error && !checked ? "border-red-500" : ""}
            `}
          >
            {/* Ícone de check (quando selecionado) */}
            {checked && (
              <Check
                className={`
                  ${currentSize.icon}
                  text-white transition-all duration-200
                `}
                strokeWidth={2.5}
              />
            )}
          </div>
        </div>

        {/* Label e descrição */}
        {(label || description) && (
          <div className="flex-1">
            {label && (
              <span
                className={`${currentSize.label} font-medium text-gray-700`}
              >
                {label}
              </span>
            )}
            {description && (
              <p className={`${currentSize.description} text-gray-400 mt-0.5`}>
                {description}
              </p>
            )}
          </div>
        )}
      </label>
    );
  },
);

Checkbox.displayName = "Checkbox";
