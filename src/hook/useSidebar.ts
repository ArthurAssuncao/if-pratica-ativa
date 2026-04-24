import { createContext, useContext } from "react";

// 1. Definimos apenas a interface e o contexto aqui
export interface SidebarContextData {
  isSidebarOpened: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  openSidebar: () => void;
}

export const SidebarContext = createContext<SidebarContextData>(
  {} as SidebarContextData,
);

// 2. Exportamos o Hook
export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar deve ser usado dentro de um SidebarProvider");
  }
  return context;
}
