import { useIsMobile } from "./useIsMobile";

/**
 * Hook que retorna booleanos baseados em breakpoints comuns.
 */
export function useBreakpoints() {
  const isMobile = useIsMobile(768);
  const isTablet = useIsMobile(1024);
  const isDesktop = !isTablet;

  return {
    isMobile, // < 768px
    isTablet, // < 1024px
    isDesktop, // >= 1024px
  };
}
