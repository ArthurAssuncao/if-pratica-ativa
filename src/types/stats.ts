export interface StatsData {
  completedQuestion: number; // Quantidade de questões resolvidas (is_correct = true)
  totalQuizzes: number; // Denominador da barra (Total que existe na disciplina ou curso)
  accuracy?: number; // Precisão em porcentagem (0-100)
  totalQuestions: number; // Quantidade de questões diferentes que o aluno interagiu
}

/**
 * Extensão específica para estatísticas de disciplina,
 * incluindo o nome amigável para exibição na aba.
 */
export interface DisciplineStats extends StatsData {
  name: string; // Ex: "Lógica de Programação"
}

/**
 * O retorno consolidado que o StudyService.processStats entrega
 * e que o componente UserStatsCard consome.
 */
export interface UserStatsResponse {
  generalStats: StatsData;
  disciplineStats: DisciplineStats | null; // Null caso nenhuma disciplina esteja selecionada
}
