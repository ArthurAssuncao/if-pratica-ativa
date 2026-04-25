import type { QuestionType } from "types/study";

export const MAPA_TIPOS_QUESTAO: Record<QuestionType, string> = {
  multipla_escolha: "Múltipla Escolha",
  verdadeiro_falso: "Verdadeiro ou Falso",
  lacuna: "Preencher Lacuna",
  predicao: "Predição de Saída",
  clique_erro: "Encontrar o Erro",
  ordenacao: "Ordenação de Código",
  fluxograma: "Fluxograma",
  fluxograma_novo: "Fluxograma (Novo)",
};

export const getTipoQuestaoPorExtenso = (tipo: QuestionType) => {
  return MAPA_TIPOS_QUESTAO[tipo];
};

export const getLetraByIndex = (index: number) => {
  return "abcdefghijklmnopqrstuvwxyz".charAt(index);
};

export const ajustarResposta = (str: string | number) =>
  str.toString().replace(/\s+/g, "").toLowerCase().trim();
