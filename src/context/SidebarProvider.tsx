"use client";

import { type ReactNode, useCallback, useState } from "react";
// Ajustado para usar o alias @hook conforme seu tsconfig.json
import { SidebarContext } from "@hook/useSidebar";

interface SidebarProviderProps {
  children: ReactNode;
}

/**
 * Provedor do estado da Sidebar.
 * Utiliza os aliases do tsconfig para garantir importações limpas.
 */
export function SidebarProvider({ children }: SidebarProviderProps) {
  const [isSidebarOpened, setIsSidebarOpened] = useState(false);

  const toggleSidebar = useCallback(() => {
    console.log("SidebarProvider - toggleSidebar");
    setIsSidebarOpened((prev) => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setIsSidebarOpened(false);
  }, []);

  const openSidebar = useCallback(() => {
    setIsSidebarOpened(true);
  }, []);

  const value = {
    isSidebarOpened,
    toggleSidebar,
    closeSidebar,
    openSidebar,
  };

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}
