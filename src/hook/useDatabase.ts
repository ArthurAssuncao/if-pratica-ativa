import { useCallback, useEffect, useState } from "react";
import { Question } from "types/study";

/**
 * Hook customizado para gerenciar a busca de questões do Neon via Netlify Functions.
 * * @param contentId O ID do conteúdo (ex: 'python-basico')
 * @returns Um objeto contendo as questões, estado de carregamento e erros.
 */
export function useDatabase(contentId: string | null) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      // Chamada para a Netlify Function que criamos anteriormente
      const response = await fetch(
        `/.netlify/functions/get-questions?contentId=${id}`,
      );

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.statusText}`);
      }

      const data = await response.json();
      setQuestions(data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Erro ao buscar dados do Neon:", err);
      setError(err.message || "Erro desconhecido ao carregar questões.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (contentId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchQuestions(contentId);
    }
  }, [contentId, fetchQuestions]);

  /**
   * Permite recarregar os dados manualmente (útil para botões de "Tentar Novamente")
   */
  const refresh = () => {
    if (contentId) fetchQuestions(contentId);
  };

  return { questions, loading, error, refresh };
}
