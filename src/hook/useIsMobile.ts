import { useEffect, useState } from "react";

export function useIsMobile(breakpoint: number = 768) {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    // Define a query (ex: largura máxima de 768px)
    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`);

    // Função para atualizar o estado
    const handleResize = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches);
    };

    // Chamada inicial para definir o estado correto no primeiro render
    handleResize(mediaQuery);

    // Adiciona o listener para mudanças de tamanho
    mediaQuery.addEventListener("change", handleResize);

    // Limpeza (cleanup) ao desmontar o componente
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, [breakpoint]);

  return isMobile;
}
