// components/ui/TextArea.tsx
import { AlertCircle } from "lucide-react";
import { forwardRef, type TextareaHTMLAttributes } from "react";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  containerClassName?: string;
  fullWidth?: boolean;
  size?: "sm" | "md" | "lg";
  showCharCount?: boolean;
  maxLength?: number;
  rows?: number;
  readonly?: boolean;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label,
      error,
      hint,
      containerClassName = "",
      className = "",
      fullWidth = true,
      size = "md",
      showCharCount = false,
      maxLength,
      rows = 4,
      required,
      disabled,
      value,
      defaultValue,
      onChange,
      id,
      readonly = false,
      ...props
    },
    ref,
  ) => {
    const textareaId = id || label?.toLowerCase().replace(/\s/g, "-");

    // Calcula a contagem de caracteres atual
    const currentLength =
      typeof value === "string"
        ? value.length
        : typeof defaultValue === "string"
          ? defaultValue.length
          : 0;

    // Classes de tamanho
    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2.5 text-base",
      lg: "px-5 py-3 text-lg",
    };

    // Classes de largura
    const widthClass = fullWidth ? "w-full" : "w-auto";

    return (
      <div
        className={`flex flex-col gap-1.5 ${widthClass} ${containerClassName}`}
      >
        {/* Label com contador de caracteres */}
        {label && (
          <div className="flex items-center justify-between">
            <label
              htmlFor={textareaId}
              className="text-sm font-semibold text-gray-700 flex items-center gap-1"
            >
              {label}
              {required && (
                <span className="text-red-500 text-lg leading-none">*</span>
              )}
            </label>
            {showCharCount && maxLength && (
              <span className="text-xs text-gray-400">
                {currentLength} / {maxLength}
              </span>
            )}
          </div>
        )}

        {/* Container do textarea */}
        <div className="relative group">
          <textarea
            id={textareaId}
            ref={ref}
            rows={rows}
            maxLength={maxLength}
            value={value}
            defaultValue={defaultValue}
            onChange={onChange}
            disabled={disabled}
            required={required}
            readOnly={readonly}
            className={`
              ${sizeClasses[size]}
              ${widthClass}
              rounded-xl border
              text-gray-900 placeholder:text-gray-400
              transition-all duration-200 ease-out hover:border-blue-400
              ${!readonly ? "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" : "focus:outline-none focus:ring-transparent"}
              disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400

              resize-y
              ${
                error
                  ? "border-red-400 focus:ring-red-500/30 focus:border-red-500"
                  : "border-gray-200"
              }
              ${className}
            `}
            aria-invalid={!!error}
            aria-describedby={
              error
                ? `${textareaId}-error`
                : hint
                  ? `${textareaId}-hint`
                  : undefined
            }
            {...props}
          />
        </div>

        {/* Mensagens de erro e hint */}
        {error ||
          (hint && (
            <div className="min-h-5">
              {error && (
                <div
                  className="flex items-center gap-1.5 text-sm text-red-500 animate-in fade-in slide-in-from-top-1 duration-200"
                  id={`${textareaId}-error`}
                >
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              {!error && hint && (
                <div
                  className="flex items-center gap-1.5 text-xs text-gray-400"
                  id={`${textareaId}-hint`}
                >
                  <span className="inline-block w-1 h-1 rounded-full bg-gray-300" />
                  <span>{hint}</span>
                </div>
              )}
            </div>
          ))}
      </div>
    );
  },
);

TextArea.displayName = "TextArea";
