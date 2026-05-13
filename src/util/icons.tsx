import * as LucideIcons from "lucide-react";
import { AlertCircle } from "lucide-react";
import type { ReactNode } from "react";

export const lucidIconNameToIconComponent = (
  iconName: string,
  size: number = 24,
  className?: string,
  color?: string,
): ReactNode => {
  // Converte "arrow-left" para "ArrowLeft"
  const componentName = iconName
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

  // Obtém o componente do Lucide
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComponent = (LucideIcons as any)[componentName];

  // Se o ícone não existir, retorna um ícone de erro
  if (!IconComponent) {
    console.warn(`Ícone "${iconName}" não encontrado. Usando fallback.`);
    return (
      <AlertCircle
        size={size}
        className={className}
        color={color || "#ef4444"}
      />
    );
  }

  return <IconComponent size={size} className={className} color={color} />;
};
