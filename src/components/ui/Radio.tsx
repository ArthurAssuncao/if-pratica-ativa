// components/ui/Radio.tsx
import { forwardRef, type InputHTMLAttributes } from "react";

interface RadioProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  error?: boolean;
  radioSize?: "sm" | "md" | "lg";
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      label,
      description,
      error = false,
      radioSize = "md",
      disabled,
      checked,
      className = "",
      id,
      name,
      ...props
    },
    ref,
  ) => {
    const radioId = id || label?.toLowerCase().replace(/\s/g, "-");

    // Classes de tamanho
    const radioSizeClasses = {
      sm: {
        wrapper: "w-5 h-5",
        inner: "w-1.5 h-1.5",
        label: "text-sm",
        description: "text-xs",
      },
      md: {
        wrapper: "w-5 h-5",
        inner: "w-2 h-2",
        label: "text-base",
        description: "text-sm",
      },
      lg: {
        wrapper: "w-6 h-6",
        inner: "w-3 h-3",
        label: "text-lg",
        description: "text-sm",
      },
    };

    const currentSize = radioSizeClasses[radioSize];

    return (
      <label
        htmlFor={radioId}
        className={`
          inline-flex items-start gap-3 cursor-pointer
          ${disabled ? "opacity-50 cursor-not-allowed" : "hover:opacity-80"}
          transition-opacity duration-200
          ${className}
        `}
      >
        {/* Radio button customizado */}
        <div className="relative shrink-0">
          <input
            ref={ref}
            id={radioId}
            type="radio"
            name={name}
            disabled={disabled}
            checked={checked}
            className="sr-only"
            {...props}
          />

          {/* Círculo externo */}
          <div
            className={`
              ${currentSize.wrapper}
              rounded-full border-2 transition-all duration-200
              flex items-center justify-center
              ${
                checked
                  ? "border-blue-500 bg-blue-500"
                  : "border-gray-300 bg-white"
              }
              ${!disabled && "hover:border-blue-400"}
              ${error && !checked ? "border-red-500" : ""}
            `}
          >
            {/* Círculo interno (quando selecionado) */}
            {checked && (
              <div
                className={`
                  rounded-full bg-white transition-all duration-200
                  ${currentSize.inner}
                `}
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

Radio.displayName = "Radio";
