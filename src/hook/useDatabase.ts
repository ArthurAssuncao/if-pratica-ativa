import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { StudyService } from "service/study-service";
import type { UserProgressDatabase } from "types/database";
import type { Lesson } from "types/lesson";
import type { Content, Discipline, Question } from "types/study";
import type { UserProgress } from "types/user";

/**
 * Hook para buscar todas as disciplinas disponíveis.
 * Ideal para Sidebar ou menus de navegação principal.
 */
export function useDisciplines() {
  return useQuery<Discipline[]>({
    queryKey: ["disciplines"],
    queryFn: () => StudyService.getDisciplines(),
    staleTime: 1000 * 60 * 30, // Dados estáveis por 30 minutos
  });
}

/**
 * Hook para buscar conteúdos filtrados por uma disciplina.
 * @param disciplineId ID da disciplina (ex: 'python', 'informatica')
 */
export function useContents(disciplineId?: string) {
  return useQuery<Content[]>({
    queryKey: ["contents", disciplineId],
    queryFn: () => StudyService.getContents(disciplineId!),
    enabled: !!disciplineId, // Só executa se houver ID
    staleTime: 1000 * 60 * 10, // Cache de 10 minutos
  });
}

export function useContentsWithQuestions(disciplineId?: string) {
  return useQuery<Content[]>({
    queryKey: ["contents", disciplineId],
    queryFn: () => StudyService.getContentsWithQuestions(disciplineId!),
    enabled: !!disciplineId, // Só executa se houver ID
    staleTime: 1000 * 60 * 10, // Cache de 10 minutos
  });
}

export function useContentsWithQuestionsMultipleRequest(disciplineId?: string) {
  return useQuery<Content[]>({
    queryKey: ["contents", disciplineId],
    queryFn: async () => {
      // 1. Busca a lista de conteúdos básicos vinculados à disciplina
      const contents = await StudyService.getContents(disciplineId!);

      // 2. Para cada conteúdo retornado, busca suas respectivas questões em paralelo
      // Utilizamos Promise.all para otimizar o tempo de resposta
      const contentsWithQuestions = await Promise.all(
        contents.map(async (content) => {
          const questions = await StudyService.getQuestions(content.id);
          return {
            ...content,
            questions, // Injeta o array de questões no objeto do conteúdo
          };
        }),
      );

      return contentsWithQuestions;
    },
    enabled: !!disciplineId,
    staleTime: 1000 * 60 * 10, // 10 minutos
  });
}

/**
 * Hook para buscar questões filtradas por um conteúdo específico.
 * @param contentId O identificador do conteúdo (ex: 'python-basico')
 */
export function useQuestions(contentId?: string) {
  return useQuery<Question[]>({
    queryKey: ["questions", contentId],
    queryFn: () => StudyService.getQuestions(contentId!),
    enabled: !!contentId,
    staleTime: 1000 * 60 * 5, // Cache de 5 minutos
  });
}

/**
 * Hook utilitário para ações globais de cache.
 */
export function useDatabaseActions() {
  const queryClient = useQueryClient();

  return {
    refreshAll: () => queryClient.invalidateQueries(),
    refreshDisciplines: () =>
      queryClient.invalidateQueries({ queryKey: ["disciplines"] }),
    refreshContent: (disciplineId: string) =>
      queryClient.invalidateQueries({ queryKey: ["contents", disciplineId] }),
  };
}

export function useGithubActions() {
  const queryClient = useQueryClient();

  return {
    refreshAll: () => queryClient.invalidateQueries(),
    refreshLessons: (disciplineId?: string) =>
      queryClient.invalidateQueries({ queryKey: ["lessons", disciplineId] }),
    refreshLessonMarkdown: (disciplineId?: string, slug?: string) =>
      queryClient.invalidateQueries({
        queryKey: ["lessonMarkdown", disciplineId, slug],
      }),
  };
}

export function useLessons(disciplineId?: string) {
  return useQuery<Lesson[]>({
    queryKey: ["lessons", disciplineId],
    queryFn: async () => {
      if (!disciplineId) throw new Error("ID da disciplina é obrigatório");

      // Chamada para a nova função no Service que busca do GitHub
      const data = await StudyService.getLessonsAvailable(disciplineId);

      console.log(`Dados carregados para ${disciplineId}:`, data);
      return data;
    },
    enabled: !!disciplineId, // Só executa se houver ID
    staleTime: 1000 * 60 * 10, // Cache de 10 minutos
  });
}

export function useLessonMarkdown(slug: string, disciplineId?: string) {
  return useQuery<string>({
    queryKey: ["lessonMarkdown", disciplineId, slug],
    queryFn: () => StudyService.getLessonMarkdown(slug, disciplineId!),
    enabled: !!disciplineId && !!slug, // Só executa se houver ID e slug
    staleTime: 1000 * 60 * 10, // Cache de 10 minutos
  });
}

export function useUserProgress(
  userId: string | undefined,
  disciplineSlug?: string,
) {
  return useQuery<UserProgress[]>({
    queryKey: ["userProgress", userId, disciplineSlug],
    queryFn: () => StudyService.getUserProgress(userId!, disciplineSlug),
    // Só executa se tiver um userId logado
    enabled: !!userId,
    // Como progresso muda com frequência, podemos deixar um staleTime menor
    // ou removê-lo para sempre buscar a versão mais recente ao mudar de página
    staleTime: 1000 * 60 * 5, // 5 minutos de cache
  });
}

export function useSubmitAnswer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      user_id: string;
      question_id: number;
      discipline_slug: string;
      is_correct: boolean;
    }) => StudyService.postUserProgress(payload),

    onSuccess: (_, variables) => {
      // Quando o post funcionar, avisamos ao React Query para atualizar a lista
      // Isso vai disparar o refetch do hook useUserProgress automaticamente
      queryClient.invalidateQueries({
        queryKey: [
          "userProgress",
          variables.user_id,
          variables.discipline_slug,
        ],
        exact: false, // Garante que qualquer query que comece com essa chave seja atualizada
      });
    },
  });
}

export function useSubmitAnswerComplex() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      user_id: string;
      question_id: number;
      discipline_slug: string;
      is_correct: boolean;
    }) => StudyService.postUserProgress(payload),

    // Usando Optimistic Update para refletir o "attempts + 1" instantaneamente
    onSuccess: (_, variables) => {
      const queryKey = [
        "userProgress",
        variables.user_id,
        variables.discipline_slug ? variables.discipline_slug : undefined,
      ];

      // Atualizamos o cache manualmente
      queryClient.setQueryData(
        queryKey,
        (oldData: UserProgressDatabase[] | undefined) => {
          if (!oldData) return [];

          const existingRecordIndex = oldData.findIndex(
            (p) => p.question_id === variables.question_id,
          );

          if (existingRecordIndex > -1) {
            // Se já existe, clonamos o array e aumentamos o attempt do item específico
            const newData = [...oldData];
            const current = newData[existingRecordIndex];

            newData[existingRecordIndex] = {
              ...current,
              attempts: current.attempts + 1,
              discipline_slug: current.discipline_slug,
              is_correct: current.is_correct || variables.is_correct,
              last_attempt_at: new Date().toISOString(),
              solved_at:
                variables.is_correct && !current.is_correct
                  ? new Date().toISOString()
                  : current.solved_at,
            };
            return newData;
          }

          // Se é a primeira vez que ele faz a questão
          return [
            ...oldData,
            {
              question_id: variables.question_id,
              discipline_slug: variables.discipline_slug,
              attempts: 1,
              is_correct: variables.is_correct,
              last_attempt_at: new Date().toISOString(),
              solved_at: variables.is_correct ? new Date().toISOString() : null,
            },
          ];
        },
      );

      // Opcional: invalidar para garantir sincronia total com o servidor após o update local
      // queryClient.invalidateQueries({ queryKey });
    },
  });
}

export function useTotalSolved(
  userId: string | undefined,
  disciplineSlug: string,
) {
  return useQuery<UserProgress[], Error, number>({
    queryKey: ["userProgress", userId, disciplineSlug],
    queryFn: () => StudyService.getUserProgress(userId!, disciplineSlug),
    enabled: !!userId,
    // Transforma o array em um número simples
    select: (data) => data.filter((p) => p.isCorrect).length,
  });
}
