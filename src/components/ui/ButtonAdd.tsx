import type React from "react";

interface ButtonAddProps {
  onClick: () => void;
  children: React.ReactNode | string;
}

export const ButtonAdd = ({ onClick, children }: ButtonAddProps) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-row text-[10px] bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-100 px-2 py-1 rounded-lg font-bold hover:cursor-pointer hover:text-blue-800"
    >
      {children}
    </button>
  );
};
