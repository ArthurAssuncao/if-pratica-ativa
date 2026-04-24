import { Question } from "types/study";

export const StudyService = {
  getQuestions: async (contentId: string): Promise<Question[]> => {
    // Chamada para a sua Serverless Function
    const response = await fetch(`/api/get-questions?contentId=${contentId}`);
    if (!response.ok) throw new Error("Erro ao carregar questões");

    // O retorno já virá com o formato da interface Question, incluindo o JSONB mapeado
    return response.json();
  },
};
