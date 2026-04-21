import { Info } from "lucide-react";
import React from "react";

interface QuestionHintProps {
  children: React.ReactNode;
  className?: string;
}

export const QuestionHint = ({
  children,
  className = "",
}: QuestionHintProps) => {
  if (!children) return null;

  return (
    <div
      className={`
        flex items-center gap-2.5 px-3 py-2 rounded-lg 
        bg-blue-50/50 dark:bg-blue-500/10 
        border border-blue-100 dark:border-blue-400/20
        transition-all duration-300 group 
        ${className}
      `}
    >
      {/* Ícone sutil */}
      <Info
        size={16}
        className=" text-blue-500 dark:text-blue-400 shrink-0 group-hover:scale-110 transition-transform"
      />

      {/* Texto da Dica */}
      <span className="text-sm leading-snug text-blue-700/80 dark:text-blue-300/90 font-medium">
        {children}
      </span>
    </div>
  );
};
