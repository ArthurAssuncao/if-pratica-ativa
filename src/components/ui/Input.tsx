// components/ui/Input.tsx
import { AlertCircle, Eye, EyeOff, Search, X } from "lucide-react";
import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { getExclusiveClasses } from "../../util/tailwind-util";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  containerClassName?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  clearable?: boolean;
  passwordToggle?: boolean;
  fullWidth?: boolean;
  inputSize?: "sm" | "md" | "lg";
  readonly?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      containerClassName = "",
      className = "",
      leftIcon,
      rightIcon,
      clearable = false,
      passwordToggle = false,
      fullWidth = true,
      inputSize = "md",
      required,
      disabled,
      type = "text",
      value,
      defaultValue,
      readonly,
      onChange,
      id,
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [hasValue, setHasValue] = useState(!!(value || defaultValue));

    const inputId = id || label?.toLowerCase().replace(/\s/g, "-");
    const inputType = passwordToggle
      ? showPassword
        ? "text"
        : "password"
      : type;

    if (type === "search") {
      leftIcon = (
        <Search size={inputSize === "sm" ? 14 : inputSize === "lg" ? 18 : 16} />
      );
    }

    // Atualiza hasValue quando o valor muda
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(!!e.target.value);
      onChange?.(e);
    };

    const handleClear = () => {
      if (ref && "current" in ref && ref.current) {
        ref.current.value = "";
        setHasValue(false);
        const event = new Event("input", { bubbles: true });
        ref.current.dispatchEvent(event);
      }
    };

    // Classes de tamanho
    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2.5 text-base",
      lg: "px-5 py-3 text-lg",
    };

    // Classes de largura
    const widthClass = fullWidth ? "w-full h-full" : "w-auto h-auto";

    // Padding ajustado para ícones
    const leftPadding = leftIcon ? "pl-10" : "";
    const rightPadding =
      (clearable && hasValue) || rightIcon || passwordToggle ? "pr-10" : "";

    const classInput = `${sizeClasses[inputSize]}
              ${widthClass}
              ${leftPadding}
              ${rightPadding} rounded-xl border h-10
              text-gray-900 placeholder:text-gray-400
              transition-all duration-200 ease-out
              ${!readonly ? "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" : "focus:outline-none focus:ring-transparent"}
              disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400
              hover:border-blue-500/70`;
    const classInputFiltered = getExclusiveClasses(classInput, className);

    return (
      <div
        className={`flex flex-col gap-1.5 ${widthClass} ${containerClassName}`}
      >
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-semibold text-gray-700 flex items-center gap-1 "
          >
            {label}
            {required && (
              <span className="text-red-500 text-lg leading-none">*</span>
            )}
          </label>
        )}

        {/* Container do input */}
        <div className="relative group">
          {/* Ícone esquerdo */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              {leftIcon}
            </div>
          )}

          {/* Input */}
          <input
            id={inputId}
            ref={ref}
            type={inputType}
            value={value}
            defaultValue={defaultValue}
            onChange={handleChange}
            disabled={disabled}
            required={required}
            readOnly={readonly}
            className={`

              ${classInputFiltered}
              ${
                error
                  ? "border-red-400 focus:ring-red-500/30 focus:border-red-500"
                  : "border-gray-200"
              }
              ${className}
            `}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
            }
            {...props}
          />

          {/* Botão de limpar */}
          {clearable && hasValue && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors hover:cursor-pointer"
              aria-label="Limpar"
            >
              <X
                size={inputSize === "sm" ? 14 : inputSize === "lg" ? 18 : 16}
              />
            </button>
          )}

          {/* Ícone direito customizado */}
          {rightIcon && !passwordToggle && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              {rightIcon}
            </div>
          )}

          {/* Botão de toggle de senha */}
          {passwordToggle && !disabled && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors hover:cursor-pointer"
              aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
            >
              {showPassword ? (
                <EyeOff size={inputSize === "sm" ? 16 : 18} />
              ) : (
                <Eye size={inputSize === "sm" ? 16 : 18} />
              )}
            </button>
          )}
        </div>

        {/* Mensagens de erro e hint */}
        <div className="min-h-5 absolute">
          {error && (
            <div
              className="flex items-center gap-1.5 text-sm text-red-500 animate-in fade-in slide-in-from-top-1 duration-200"
              id={`${inputId}-error`}
            >
              <AlertCircle size={14} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {!error && hint && (
            <div
              className="flex items-center gap-1.5 text-xs text-gray-400"
              id={`${inputId}-hint`}
            >
              <span className="inline-block w-1 h-1 rounded-full bg-gray-300" />
              <span>{hint}</span>
            </div>
          )}
        </div>
      </div>
    );
  },
);

Input.displayName = "Input";
