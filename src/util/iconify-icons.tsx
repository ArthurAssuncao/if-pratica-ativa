import { Icon } from "@iconify/react";
import memoize from "just-memoize";
import type { ReactNode } from "react";

export const iconifyIconNameToIconComponent = memoize(
  (
    iconName: string,
    size: number = 24,
    className?: string,
    color?: string,
  ): ReactNode => {
    // O Iconify já aceita o formato "prefixo:nome-do-icone"
    // Exemplo: "mdi:home", "fa:cat", "simple-icons:github"

    // Validação básica: verificar se tem o formato "prefixo:nome"
    if (!iconName.includes(":")) {
      console.warn(
        `Ícone Iconify "${iconName}" não está no formato "prefixo:nome". Usando fallback.`,
      );
      // Fallback simples sem depender do Lucide
      return (
        <span
          className={className}
          style={{ color: color || "#ef4444", fontSize: size }}
        >
          ❌
        </span>
      );
    }

    // Retorna o ícone diretamente usando o componente do Iconify
    return (
      <Icon
        icon={iconName}
        width={size}
        height={size}
        className={className}
        color={color}
      />
    );
  },
);
