// components/ui/TrashButton.tsx
import { forwardRef, type ButtonHTMLAttributes } from "react";

interface NegativeActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  icon?: React.ReactNode;
}

export const NegativeActionButton = forwardRef<
  HTMLButtonElement,
  NegativeActionButtonProps
>(({ icon, text, className = "", disabled, ...props }, ref) => {
  return (
    <button
      ref={ref}
      disabled={disabled}
      className={`
          flex
          flex-row
          items-center
        justify-center
        gap-1
          p-1.5
          text-slate-400
          rounded-lg
          transition-all duration-200
          hover:text-rose-500
          hover:bg-rose-50
          hover:ring-2 hover:ring-red-500
          hover:cursor-pointer
          focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:ring-0 disabled:hover:bg-transparent disabled:text-slate-400
          ${className}
        `}
      {...props}
    >
      {icon}
      {text}
    </button>
  );
});

NegativeActionButton.displayName = "NegativeActionButton";
