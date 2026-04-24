import { useSidebar } from "hook/useSidebar";
import { Laptop } from "lucide-react";
import React from "react";

interface SidebarProps {
  children: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  const { isSidebarOpened, closeSidebar } = useSidebar();
  console.log("Sidebar", isSidebarOpened);
  return (
    <>
      {/* Overlay para Mobile: Só aparece quando isOpen é true e em telas menores que LG */}
      {isSidebarOpened && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden transition-opacity"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-49 w-80 max-w-full transition-transform duration-300 ease-in-out transform
          bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800
          lg:translate-x-0 lg:static  h-full max-h-screen overflow-y-auto
          ${isSidebarOpened ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <span className="flex items-center h-12 px-4 pt-2 gap-2">
          <div className="flex items-center bg-white p-1 rounded-lg">
            <Laptop className="text-blue-700" size={20} />
          </div>
          <span className="text-xl font-bold tracking-tight text-blue-600 dark:text-white">
            <span className="text-slate-700 dark:slate-200">
              IF Prática Ativa
            </span>
          </span>
        </span>
        {children}
      </aside>
    </>
  );
};
