import { useSidebar } from "hook/useSidebar";
import React from "react";

interface SidebarProps {
  children: React.ReactNode;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ children, className }) => {
  const { isSidebarOpened, closeSidebar } = useSidebar();

  return (
    <>
      {/* Overlay para Mobile: Só aparece quando isOpen é true e em telas menores que LG */}
      {isSidebarOpened && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`
          fixed top-16 bottom-0 left-0 z-49 transition-transform duration-300 ease-in-out transform

          lg:translate-x-0 lg:static
          ${isSidebarOpened ? "translate-x-0" : "-translate-x-full"}
          ${className}
        `}
      >
        {children}
      </aside>
    </>
  );
};
