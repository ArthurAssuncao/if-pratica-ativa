import type {
  ContentWithQuestionsDatabase,
  DisciplineDatabase,
  QuestionDatabase,
  UserDatabase,
  UserProgressDatabase,
} from "types/database";
import type { Lesson } from "types/lesson";
import type { UserStatsResponse } from "types/stats";
import type { Content, Discipline, Question } from "types/study";
import type { UserProgress } from "types/user";
import { mapDatabaseToQuestion } from "util/database";

const GET_URL = "/.netlify/functions/get-data";
const POST_URL = "/.netlify/functions/post-data";

export const StudyService = {
  // --- BUSCA DE DADOS (GET) ---

  getDisciplines: async (): Promise<Discipline[]> => {
    try {
      const response = await fetch(`${GET_URL}?type=disciplines`);
      if (!response.ok) throw new Error(`Erro: ${response.statusText}`);

      const disciplinesData = (await response.json()) as DisciplineDatabase[];
      return disciplinesData.map((d) => ({
        ...d,
        iconSlug: d.icon_slug,
      })) as Discipline[];
    } catch (error) {
      console.error("Erro ao buscar disciplinas:", error);
      return [];
    }
  },

  getContents: async (disciplineId: string): Promise<Content[]> => {
    try {
      const response = await fetch(
        `${GET_URL}?type=contents&disciplineId=${disciplineId}`,
      );
      if (!response.ok) throw new Error(`Erro: ${response.statusText}`);
      return (await response.json()) as Content[];
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
        `${GET_URL}?type=contentsWithQuestions&disciplineId=${disciplineId}`,
      );
      if (!response.ok) throw new Error(`Erro: ${response.statusText}`);

      const contentsWithQuestions =
        (await response.json()) as ContentWithQuestionsDatabase[];
      const contentsMap = new Map<string, Content>();

      contentsWithQuestions.forEach((content) => {
        if (!contentsMap.has(content.id)) {
          contentsMap.set(content.id, {
            id: content.id,
            name: content.content_name,
            level: content.content_level,
            questions: [],
          });
        }

        const currentContent = contentsMap.get(content.id)!;

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
          currentContent.questions.push(
            mapDatabaseToQuestion(newQuestionDatabase),
          );
        }
      });

      return Array.from(contentsMap.values());
    } catch (error) {
      console.error("Erro ao buscar conteúdos com questões:", error);
      return [];
    }
  },

  getQuestions: async (contentId: string): Promise<Question[]> => {
    try {
      const response = await fetch(
        `${GET_URL}?type=questions&contentId=${contentId}`,
      );
      if (!response.ok) throw new Error(`Erro: ${response.statusText}`);
      const data = (await response.json()) as QuestionDatabase[];
      return data.map((question) => mapDatabaseToQuestion(question));
    } catch (error) {
      console.error("Erro ao buscar questões:", error);
      return [];
    }
  },

  getLessonsAvailable: async (disciplineId: string): Promise<Lesson[]> => {
    try {
      const response = await fetch(
        `${GET_URL}?type=lessons&disciplineId=${disciplineId}`,
      );
      if (!response.ok) throw new Error(`Erro: ${response.statusText}`);
      return (await response.json()) as Lesson[];
    } catch (error) {
      console.error("Erro ao buscar lições:", error);
      return [];
    }
  },

  getLessonMarkdown: async (
    disciplineId: string,
    slug: string,
  ): Promise<string> => {
    try {
      const response = await fetch(
        `${GET_URL}?type=lessonMarkdown&disciplineId=${disciplineId}&slug=${slug}`,
      );
      if (!response.ok) throw new Error(`Erro: ${response.statusText}`);
      return await response.text();
    } catch (error) {
      console.error("Erro ao buscar markdown:", error);
      return "";
    }
  },

  getUserRawStats: async (userId: string): Promise<UserStatsResponse[]> => {
    try {
      const response = await fetch(
        `${GET_URL}?type=userStats&userId=${userId}`,
      );
      if (!response.ok) throw new Error(`Erro: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error("Erro ao buscar estatísticas brutas:", error);
      return [];
    }
  },

  // --- PERSISTÊNCIA DE DADOS (POST) ---

  syncProfile: async (user: UserDatabase) => {
    try {
      const response = await fetch(`${POST_URL}?type=user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      return await response.json();
    } catch (error) {
      console.error("Erro ao sincronizar perfil:", error);
    }
  },

  postUserProgress: async (payload: {
    user_id: string;
    question_id: number;
    discipline_slug: string;
    is_correct: boolean;
  }): Promise<void> => {
    try {
      const response = await fetch(`${POST_URL}?type=userProgress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Falha ao salvar progresso");
    } catch (error) {
      console.error("Erro ao postar progresso:", error);
    }
  },

  getUserProgress: async (
    userId: string,
    disciplineSlug?: string,
  ): Promise<UserProgress[]> => {
    try {
      const params = new URLSearchParams({
        type: "user_progress",
        userId: userId,
      });

      if (disciplineSlug) {
        params.append("disciplineSlug", disciplineSlug);
      }

      // Monta a URL final concatenando a constante com a string de parâmetros
      const finalUrl = `${GET_URL}?${params.toString()}`;

      const response = await fetch(finalUrl);

      const userProgressData =
        (await response.json()) as UserProgressDatabase[];

      const userProgress: UserProgress[] = userProgressData.map((data) => ({
        attempts: data.attempts,
        questionId: data.question_id,
        disciplineSlug: data.discipline_slug,
        isCorrect: data.is_correct,
        solvedAt: data.solved_at ? new Date(data.solved_at) : null,
        lastAttemptAt: new Date(data.last_attempt_at),
      }));

      if (!response.ok) throw new Error(`Erro: ${response.statusText}`);

      return userProgress;
    } catch (error) {
      console.error("Erro ao buscar progresso do usuário:", error);
      return [];
    }
  },

  // --- UTILITÁRIOS ---

  // processStats(
  //   data: any[],
  //   currentDisciplineSlug: string,
  //   totalQuestionsInDiscipline: number = 0,
  // ): UserStatsResponse {
  //   const general = data.reduce(
  //     (acc, curr) => ({
  //       completedQuizzes: acc.completedQuizzes + Number(curr.total_solved),
  //       totalQuestions: acc.totalQuestions + Number(curr.total_attempted),
  //       totalTries: acc.totalTries + Number(curr.total_tries),
  //     }),
  //     { completedQuizzes: 0, totalQuestions: 0, totalTries: 0 },
  //   );

  //   const discData = data.find(
  //     (d) => d.discipline_slug === currentDisciplineSlug,
  //   );

  //   const disciplineStats = discData
  //     ? {
  //         completedQuizzes: Number(discData.total_solved),
  //         totalQuizzes: totalQuestionsInDiscipline, // Denominador real da disciplina
  //         totalQuestions: Number(discData.total_attempted),
  //         accuracy: Math.round(
  //           (Number(discData.total_solved) /
  //             (Number(discData.total_tries) || 1)) *
  //             100,
  //         ),
  //         name: discData.discipline_slug,
  //       }
  //     : null;

  //   const generalAccuracy = Math.round(
  //     (general.completedQuizzes / (general.totalTries || 1)) * 100,
  //   );

  //   return {
  //     generalStats: {
  //       completedQuizzes: general.completedQuizzes,
  //       totalQuizzes: 100, // Alvo global (pode ser dinâmico no futuro)
  //       accuracy: generalAccuracy,
  //       totalQuestions: general.totalQuestions,
  //     },
  //     disciplineStats: disciplineStats as any,
  //   };
  // },
};
