import { Nivel, TipoQuestao } from "types/quiz";

export const MAPA_TIPOS_QUESTAO: Record<TipoQuestao, string> = {
  multipla_escolha: "Múltipla Escolha",
  verdadeiro_falso: "Verdadeiro ou Falso",
  lacuna: "Preencher Lacuna",
  predicao: "Predição de Saída",
  clique_erro: "Encontrar o Erro",
  ordenacao: "Ordenação de Código",
  fluxograma: "Fluxograma",
  fluxograma_novo: "Fluxograma (Novo)",
};

// Transformando em lista para o Select
export const LISTA_TIPOS_QUESTAO = Object.entries(MAPA_TIPOS_QUESTAO).map(
  ([value, label]) => ({
    value,
    label,
  }),
);

export const MAPA_NIVEIS_QUESTAO: Record<Nivel, string> = {
  iniciante: "Iniciante",
  intermediário: "Intermediário",
  avançado: "Avançado",
};

export const LISTA_NIVEIS_QUESTAO = Object.entries(MAPA_NIVEIS_QUESTAO).map(
  ([value, label]) => ({
    value,
    label,
  }),
);

export const getTipoQuestaoPorExtenso = (tipo: TipoQuestao) => {
  return MAPA_TIPOS_QUESTAO[tipo];
};

export const getLetraByIndex = (index: number) => {
  return "abcdefghijklmnopqrstuvwxyz".charAt(index);
};
