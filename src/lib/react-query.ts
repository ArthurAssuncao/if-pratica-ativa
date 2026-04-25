import { QueryClient } from "@tanstack/react-query";

/**
 * O QueryClient é o cérebro que gere o cache.
 * Configuramos para que os dados não fiquem 'stale' (velhos) por 5 minutos por padrão.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      gcTime: 1000 * 60 * 30, // Mantém no lixo/cache por 30 minutos
      retry: 2, // Tenta 2 vezes se falhar antes de mostrar erro
      refetchOnWindowFocus: false, // Não recarrega só porque mudaste de aba
    },
  },
});
