// components/ui/TrashButton.tsx
import { Trash2 } from "lucide-react";
import { forwardRef, type ButtonHTMLAttributes } from "react";

interface TrashButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: number;
}

export const TrashButton = forwardRef<HTMLButtonElement, TrashButtonProps>(
  ({ size = 16, className = "", disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`
          p-1.5
          text-slate-400
          rounded-lg
          transition-all duration-200
          hover:text-rose-500
          hover:bg-rose-50
          hover:ring-2 hover:ring-red-500
          hover:cursor-pointer
          focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
        {...props}
      >
        <Trash2 size={size} />
      </button>
    );
  },
);

TrashButton.displayName = "TrashButton";
