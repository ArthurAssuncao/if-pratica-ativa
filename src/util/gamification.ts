export interface Rank {
  level: number;
  name: string;
  minPoints: number;
  title: string;
}

const RANKS_NAMES = [
  "Iniciante Curioso",
  "Aprendiz Dedicado",
  "Explorador de Ideias",
  "Estudante Ágil",
  "Buscador de Verdades",
  "Analista em Ascensão",
  "Mestre da Lógica",
  "Sábio da Montanha",
  "Cientista Implacável",
  "Arquiteto do Conhecimento",
  "Visionário",
  "Lenda Acadêmica",
];

/**
 * Calcula o nível do estudante com base nas questões totais respondidas.
 * Usa progressão geométrica: Nível 1 = 10, Nível 2 = 21, etc.
 */
export function getStudentLevel(
  totalQuestions: number,
  tipoRanking: "geral" | "disciplina",
): Rank {
  let level = 0;
  let pointsForNextLevel = tipoRanking == "geral" ? 10 : 2;
  let accumulatedPoints = 0;

  // Enquanto o total de pontos acumulados para o PRÓXIMO nível
  // for menor ou igual ao que o estudante fez, subimos de nível.
  while (totalQuestions >= accumulatedPoints + pointsForNextLevel) {
    accumulatedPoints += pointsForNextLevel;
    level++;
    // Aumenta a dificuldade em 10% para o próximo nível
    pointsForNextLevel = Math.round(pointsForNextLevel * 1.1);
  }

  // Define o nome do ranking (pega o último se ultrapassar a lista)
  const rankIndex = Math.min(level, RANKS_NAMES.length - 1);
  const name = RANKS_NAMES[rankIndex];

  return {
    level,
    name: name,
    minPoints: accumulatedPoints,
    title: `Nível ${level} - ${name}`,
  };
}

/**
 * Calcula quanto falta para o próximo nível (útil para barras de progresso)
 */
export function getProgressToNextLevel(
  totalQuestions: number,
  tipoRanking: "geral" | "disciplina",
) {
  const current = getStudentLevel(totalQuestions, tipoRanking);
  const nextPointsNeed = Math.round(10 * Math.pow(1.1, current.level));
  const pointsSinceLevelStart = totalQuestions - current.minPoints;

  return {
    percentage: Math.min((pointsSinceLevelStart / nextPointsNeed) * 100, 100),
    remaining: nextPointsNeed - pointsSinceLevelStart,
  };
}
