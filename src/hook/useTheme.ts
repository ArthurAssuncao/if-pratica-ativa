import { useEffect, useState } from "react";

export function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark" | "system">(
    () =>
      (typeof window !== "undefined"
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (localStorage.theme as any)
        : "system") || "system",
  );

  useEffect(() => {
    const root = window.document.documentElement;

    // Função que aplica a lógica que você enviou
    const applyTheme = () => {
      const isDark =
        theme === "dark" ||
        (theme === "system" &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);

      root.classList.toggle("dark", isDark);
    };

    applyTheme();

    // Salva a escolha
    if (theme === "system") {
      localStorage.removeItem("theme");
    } else {
      localStorage.theme = theme;
    }
  }, [theme]);

  return { theme, setTheme };
}
