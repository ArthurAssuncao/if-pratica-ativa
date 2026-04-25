import type { QuestionDatabase, QuestionMetadata } from "types/database";
import type {
  BaseQuestion,
  Question,
  QuestionClickOnError,
  QuestionFillQuestion,
  QuestionFlowchartnNew,
  QuestionInfo,
  QuestionMultipleChoice,
  QuestionRearrange,
  QuestionType,
} from "types/study";

/**
 * Definição do mapeador (Hash Map) para conversão de tipos.
 * Cada chave corresponde a um QuestionType e retorna a estrutura formatada.
 */
const QuestionMappers: Partial<
  Record<
    QuestionType,
    (
      base: BaseQuestion,
      metadata: QuestionMetadata,
      raw: QuestionDatabase,
    ) => Question
  >
> = {
  multipla_escolha: (base, meta) => {
    return { ...base, options: meta.options || [] } as QuestionMultipleChoice;
  },
  verdadeiro_falso: (base, meta) =>
    ({ ...base, options: meta.options || [] }) as QuestionMultipleChoice,

  ordenacao: (base, meta) =>
    ({ ...base, rows: meta.rows || [] }) as QuestionRearrange,
  clique_erro: (base, meta) =>
    ({ ...base, rows: meta.rows || [] }) as QuestionClickOnError,

  lacuna: (base, meta) =>
    ({
      ...base,
      code: (meta as QuestionMetadata).code || "",
    }) as QuestionFillQuestion,
  predicao: (base, _, raw) =>
    ({
      ...base,
      code: (raw as QuestionMetadata).code || "",
    }) as QuestionFillQuestion,

  fluxograma_novo: (base, meta) =>
    ({
      ...base,
      code: (meta as QuestionMetadata).code || "",
      root: meta.root || "",
      nodes: meta.nodes || [],
      conections: meta.connections || [], // Normalização de connections -> conections
    }) as QuestionFlowchartnNew,
};

/**
 * Função principal que utiliza o Hash Map para converter QuestionDatabase para Question.
 */
export const mapDatabaseToQuestion = (q: QuestionDatabase): Question => {
  const defaultInfo: QuestionInfo = {
    status: "pendente",
    attemptCount: 0,
  };

  const base: BaseQuestion = {
    id: q.id,
    type: q.type,
    level: q.level,
    questionText: q.questionText,
    explanation: q.explanation || "",
    correctAnswer: q.correctAnswer,
    info: q.info || defaultInfo,
  };

  const metadata = q.metadata || {};
  const mapper = QuestionMappers[q.type];

  // Se houver um mapeador específico para o tipo, usamos; caso contrário, retorna o base
  const question = mapper ? mapper(base, metadata, q) : (base as Question);

  return question;
};
