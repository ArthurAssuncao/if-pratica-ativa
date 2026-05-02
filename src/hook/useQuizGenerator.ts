import { useEffect, useMemo, useState } from "react";
import type {
  Content,
  Discipline,
  Level,
  QuestionType,
  Quiz,
} from "types/study";
// Importe seus tipos aqui (Level, TipoQuestao, Discipline, etc.)

interface UseQuizGeneratorProps {
  discipline: Discipline | null;
  selectedContent: Content | null;
  level?: Level;
  questionsType?: QuestionType[];
  limit?: number;
  shuffle?: boolean;
}

export function useQuizGenerator({
  discipline,
  selectedContent,
  level,
  questionsType,
  limit,
  shuffle = true,
}: UseQuizGeneratorProps): Quiz {
  const [isReady, setIsReady] = useState(false);

  const questions = useMemo(() => {
    // eslint-disable-next-line react-hooks/set-state-in-render
    setIsReady(false);

    if (!discipline || !selectedContent) return [];

    if (!selectedContent || !selectedContent.questions) return [];

    // 1. Filtragem inicial
    let filteredQuestions = [...selectedContent.questions];

    if (level) {
      filteredQuestions = filteredQuestions.filter((q) => q.level === level);
    }

    if (questionsType && questionsType.length > 0) {
      filteredQuestions = filteredQuestions.filter((q) =>
        questionsType.includes(q.type),
      );
    }

    // 2. Embaralhamento (Fisher-Yates)
    if (shuffle) {
      for (let i = filteredQuestions.length - 1; i > 0; i--) {
        // eslint-disable-next-line react-hooks/purity
        const j = Math.floor(Math.random() * (i + 1));
        [filteredQuestions[i], filteredQuestions[j]] = [
          filteredQuestions[j],
          filteredQuestions[i],
        ];
      }
    }

    // 3. Aplicação do limite (se houver)
    // Se limit for maior que o total, o .slice() lida com isso graciosamente
    if (limit && limit > 0) {
      filteredQuestions = filteredQuestions.slice(0, limit);
    }

    return filteredQuestions;
  }, [discipline, selectedContent, level, questionsType, shuffle, limit]);

  useEffect(() => {
    if (discipline && selectedContent) {
      // Pequeno delay para evitar flashes de conteúdo e dar feedback visual
      const timer = setTimeout(() => setIsReady(true), 400);
      return () => clearTimeout(timer);
    }
  }, [questions, discipline, selectedContent]);

  return {
    questions,
    contentName: selectedContent?.name || "Não encontrado",
    discipline,
    isReady: isReady,
    total: questions.length,
  };
}
