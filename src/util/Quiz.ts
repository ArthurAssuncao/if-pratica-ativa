import type { QuestionType } from "types/study";

export const MAPA_TIPOS_QUESTAO: Record<QuestionType, string> = {
  multipla_escolha: "Múltipla Escolha",
  verdadeiro_falso: "Verdadeiro ou Falso",
  lacuna: "Preencher Lacuna",
  predicao: "Predição de Saída",
  clique_erro: "Encontrar o Erro",
  ordenacao: "Ordenação de Código",
  fluxograma: "Fluxograma",
  fluxograma_novo: "Fluxograma",
  teste_mesa: "Teste de Mesa",
};

export const TIPOS_QUESTAO = Object.keys(MAPA_TIPOS_QUESTAO) as QuestionType[];

export const getTipoQuestaoPorExtenso = (tipo: QuestionType) => {
  if (tipo in MAPA_TIPOS_QUESTAO) {
    return MAPA_TIPOS_QUESTAO[tipo];
  }
  return tipo;
};

export const getLetraByIndex = (index: number) => {
  return "abcdefghijklmnopqrstuvwxyz".charAt(index);
};

export const ajustarResposta = (str: string | number) =>
  str.toString().replace(/\s+/g, "").toLowerCase().trim();
