import { ReactNode, useLayoutEffect, useRef, useState } from "react";

interface OptionSliderProps<T> {
  options: T[];
  value: T;
  disabled: boolean;
  onChange: (value: T) => void;
  renderOption?: (option: T) => ReactNode;
  className?: string;
}

export function OptionSlider<T>({
  options,
  value,
  disabled,
  onChange,
  renderOption,
  className = "",
}: OptionSliderProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [sliderStyle, setSliderStyle] = useState({ left: 0, width: 0 });
  const [hasMounted, setHasMounted] = useState(false);

  useLayoutEffect(() => {
    const updateSliderPosition = () => {
      const activeIndex = options.findIndex((opt) => opt === value);
      const activeButton = buttonRefs.current[activeIndex];
      const container = containerRef.current;

      if (activeButton && container) {
        // A correção principal: offsetLeft já é relativo ao pai se o pai for 'relative'
        // Não subtraímos o offset do container aqui.
        const left = activeButton.offsetLeft;
        const width = activeButton.offsetWidth;

        setSliderStyle({ left, width });
      }
    };

    updateSliderPosition();

    // ResizeObserver garante que se a tela mudar de tamanho, o slider acompanhe
    const resizeObserver = new ResizeObserver(updateSliderPosition);
    if (containerRef.current) resizeObserver.observe(containerRef.current);

    const timer = setTimeout(() => setHasMounted(true), 50);

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
    };
  }, [value, options]);

  return (
    <div
      ref={containerRef}
      className={`relative flex gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 ${className}`}
      style={{
        display: "grid",
        // Ajuste dinâmico para qualquer quantidade de opções
        gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))`,
      }}
    >
      {/* O Indicador que desliza */}
      <div
        className={`
          absolute top-1 bottom-1 rounded-xl border-2 border-blue-500 bg-white dark:bg-blue-500/10 z-0
          ${hasMounted ? "transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1)" : "opacity-0"}
        `}
        style={{
          left: `${sliderStyle.left}px`,
          width: `${sliderStyle.width}px`,
        }}
      />

      {/* Os Botões */}
      {options.map((option, index) => {
        const isActive = value === option;

        return (
          <button
            key={String(option)}
            ref={(el) => {
              buttonRefs.current[index] = el;
            }}
            onClick={() => (disabled ? null : onChange(option))}
            type="button"
            className={`
              relative z-10 py-2.5 text-sm font-bold rounded-xl transition-colors duration-200 
              ${
                isActive
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 border-2 border-transparent hover:border-slate-300 dark:hover:border-slate-500"
              }
              ${disabled ? "**:cursor-not-allowed" : "**:cursor-pointer"}
            `}
          >
            {renderOption ? renderOption(option) : String(option)}
          </button>
        );
      })}
    </div>
  );
}
