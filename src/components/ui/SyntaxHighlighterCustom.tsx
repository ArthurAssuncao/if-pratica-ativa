import { useIsMobile } from "hook/useIsMobile";
import { useEffect, useState } from "react";
import SyntaxHighlighter, {
  SyntaxHighlighterProps,
} from "react-syntax-highlighter";
import { nnfx, nord } from "react-syntax-highlighter/dist/esm/styles/hljs";

interface SyntaxHighlighterCustomProps extends SyntaxHighlighterProps {
  theme?: "dark" | "light";
  showLineNumbers?: boolean;
  padding?: number;
  children: string | string[];
}

export const SyntaxHighlighterCustom = ({
  theme,
  showLineNumbers = true,
  padding,
  children,

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
      language="python"
      style={appTheme === "dark" ? nord : nnfx}
      customStyle={{
        background: "trasnparent",
        paddingLeft: "0px",
        padding: padding ? `${padding}px !important` : "0px !important",
      }}
      showLineNumbers={showLineNumbers}
      lineNumberContainerStyle={{
        borderRight: "1px solid #ccc",
      }}
      wrapLines
      {...syntaxHighlighterProps}
    >
      {isMobile ? textoReduzidoEspacos : children}
    </SyntaxHighlighter>
  );
};
