import type {
  ContentWithQuestionsDatabase,
  DisciplineDatabase,
  QuestionDatabase,
} from "types/database";
import type { Lesson } from "types/lesson";
import type { Content, Discipline, Question } from "types/study";
import { mapDatabaseToQuestion } from "util/database";

const BASE_URL = "/.netlify/functions/get-data";

/**
 * Serviço responsável pela comunicação centralizada com a Netlify Function 'get-data'.
 * Esta função atua como um roteador para o banco de dados Neon.
 */
export const StudyService = {
  /**
   * Busca todas as disciplinas para a listagem principal.
   */
  getDisciplines: async (): Promise<Discipline[]> => {
    try {
      const response = await fetch(`${BASE_URL}?type=disciplines`);
      if (!response.ok) throw new Error(`Erro: ${response.statusText}`);

      const disciplinesData = (await response.json()) as DisciplineDatabase[];
      const disciplines = disciplinesData.map((d) => ({
        ...d,
        iconSlug: d.icon_slug,
      }));

      return disciplines as Discipline[];
    } catch (error) {
      console.error("Erro ao buscar disciplinas:", error);
      return [];
    }
  },

  /**
   * Busca os conteúdos vinculados a uma disciplina específica.
   */
  getContents: async (disciplineId: string): Promise<Content[]> => {
    try {
      const response = await fetch(
        `${BASE_URL}?type=contents&disciplineId=${disciplineId}`,
      );
      if (!response.ok) throw new Error(`Erro: ${response.statusText}`);

      const contents = await response.json();
      return contents as Content[];
    } catch (error) {
      console.error("Erro ao buscar conteúdos:", error);
      return [];
    }
  },

  getContentsWithQuestions: async (
    disciplineId: string,
  ): Promise<Content[]> => {
    try {
      const response = await fetch(
        `${BASE_URL}?type=contentsWithQuestions&disciplineId=${disciplineId}`,
      );
      if (!response.ok) throw new Error(`Erro: ${response.statusText}`);

      const contentsWithQuestions =
        (await response.json()) as ContentWithQuestionsDatabase[];
      const contentsMap = new Map<string, Content>();

      contentsWithQuestions.forEach((content: ContentWithQuestionsDatabase) => {
        let newContent: Content;

        if (!contentsMap.has(content.id)) {
          newContent = {
            id: content.id,
            name: content.content_name,
            level: content.content_level,
            questions: [],
          };
          contentsMap.set(content.id, newContent);
        } else {
          newContent = contentsMap.get(content.id)!;
        }
        if (content.question_id) {
          const newQuestionDatabase: QuestionDatabase = {
            id: content.question_id,
            type: content.type,
            level: content.question_level,
            questionText: content.question_text,
            explanation: content.explanation || "",
            correctAnswer: content.correct_answer,
            metadata: content.metadata,
            info: { status: "pendente", attemptCount: 0 },
          };

          const newQuestion = mapDatabaseToQuestion(newQuestionDatabase);
          newContent.questions.push(newQuestion);
        }
      });

      // Depois converter para array se precisar
      const contents = Array.from(contentsMap.values());

      return contents;
    } catch (error) {
      console.error("Erro ao buscar conteúdos:", error);
      return [];
    }
  },

  /**
   * Busca as questões vinculadas a um conteúdo específico.
   */
  getQuestions: async (contentId: string): Promise<Question[]> => {
    try {
      const response = await fetch(
        `${BASE_URL}?type=questions&contentId=${contentId}`,
      );

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.statusText}`);
      }

      const data = (await response.json()) as QuestionDatabase[];

      const dataQuestion = data.map((question) =>
        mapDatabaseToQuestion(question),
      );

      // O JSONB (metadata) já vem parseado como objeto pelo driver do Neon
      return dataQuestion;
    } catch (error) {
      console.error("Erro ao buscar questões:", error);
      return [];
    }
  },

  async getLessonsAvailable(disciplineId: string): Promise<Lesson[]> {
    try {
      const response = await fetch(
        `${BASE_URL}?type=lessons&disciplineId=${disciplineId}`,
      );

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.statusText}`);
      }

      const data = (await response.json()) as Lesson[];
      return data;
    } catch (error) {
      console.error("Erro ao buscar questões:", error);
      return [];
    }
  },

  async getLessonMarkdown(disciplineId: string, slug: string): Promise<string> {
    try {
      const response = await fetch(
        `${BASE_URL}?type=lessonMarkdown&disciplineId=${disciplineId}&slug=${slug}`,
      );

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.statusText}`);
      }

      const data = (await response.text()) as string;
      return data;
    } catch (error) {
      console.error("Erro ao buscar questões:", error);
      return "";
    }
  },
};
