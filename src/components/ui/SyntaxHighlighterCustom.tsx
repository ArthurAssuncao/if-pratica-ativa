import { useIsMobile } from "hook/useIsMobile";
import { useEffect, useState } from "react";
import SyntaxHighlighter, {
  type SyntaxHighlighterProps,
} from "react-syntax-highlighter";
import { nnfx, nord } from "react-syntax-highlighter/dist/esm/styles/hljs";

interface SyntaxHighlighterCustomProps extends SyntaxHighlighterProps {
  language?: string;
  theme?: "dark" | "light";
  showLineNumbers?: boolean;
  padding?: number;
  children: string | string[];
  highlightLines?: number[];
}

export const SyntaxHighlighterCustom = ({
  language = "python",
  theme,
  showLineNumbers = true,
  padding,
  children,
  highlightLines,
  syntaxHighlighterProps,
}: SyntaxHighlighterCustomProps) => {
  const [appTheme, setAppTheme] = useState<"dark" | "light">(() => {
    if (theme) return theme;
    return document.documentElement.classList.contains("dark")
      ? "dark"
      : "light";
  });
  const isMobile = useIsMobile();

  useEffect(() => {
    // 1. Se o tema vier por props, ele tem prioridade total
    if (theme) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAppTheme(theme);
      return;
    }

    // 2. Se não houver prop, monitoramos o HTML para mudanças manuais
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains("dark");
      setAppTheme(isDark ? "dark" : "light");
    });

    // Configuramos o observer para observar mudanças de atributos (como 'class')
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // 3. Cleanup: Desligamos o "espião" quando o componente morre
    return () => observer.disconnect();
  }, [theme]);

  const textoReduzidoEspacos = Array.isArray(children)
    ? children.map((t) => t.replaceAll("  ", " "))
    : children?.replaceAll("  ", " ");

  return (
    <SyntaxHighlighter
      language={language}
      style={appTheme === "dark" ? nord : nnfx}
      customStyle={{
        background: "trasnparent",
        paddingLeft: "0px",
        padding: padding ? `${padding}px !important` : "0px !important",
        fontSize: "0.9rem",
      }}
      showLineNumbers={showLineNumbers}
      lineNumberContainerStyle={{
        borderRight: "1px solid #ccc",
      }}
      wrapLines
      lineProps={(lineNumber) => {
        const isHighlighted = highlightLines?.includes(lineNumber);
        const style: React.CSSProperties = {
          display: "block",
          width: "100%",
          transition: "all 0.3s ease",
        };

        if (isHighlighted) {
          style.backgroundColor =
            appTheme === "dark"
              ? "rgba(59, 130, 246, 0.25)" // Azul sutil no Dark
              : "rgba(59, 130, 246, 0.15)"; // Azul sutil no Light
          style.borderLeft = "4px solid #3b82f6";
          style.marginLeft = "-4px"; // Ajuste para a borda não empurrar o texto
        }

        return { style };
      }}
      lineNumberStyle={{
        minWidth: "2.5em",
        paddingRight: "1em",
        color: appTheme === "dark" ? "#4c566a" : "#94a3b8",
        textAlign: "right",
        userSelect: "none",
      }}
      {...syntaxHighlighterProps}
    >
      {isMobile ? textoReduzidoEspacos : children}
    </SyntaxHighlighter>
  );
};
