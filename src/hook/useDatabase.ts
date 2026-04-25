import { useQuery, useQueryClient } from "@tanstack/react-query";
import { StudyService } from "service/study-service";
import type { Lesson } from "types/lesson";
import type { Content, Discipline, Question } from "types/study";

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
