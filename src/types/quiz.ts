export type StatusQuestao = "correta" | "errada" | "pendente";

export type Nivel = "iniciante" | "intermediário" | "avançado";

export interface InfoQuestao {
  status: StatusQuestao;
  numeroTentativas: number;
}

export type TipoQuestao =
  | "multipla_escolha"
  | "verdadeiro_falso"
  | "lacuna"
  | "predicao"
  | "clique_erro"
  | "ordenacao"
  | "fluxograma"
  | "fluxograma_novo";

export type OrdenacaoLinha = { texto: string; identationLevel: number };

export type FluxogramaRamo = { id: string; label: string; correta: boolean };

export type TipoQuiz = "automatico" | "manual";

export interface Questao {
  id: number;
  tipo: TipoQuestao;

  // Para clique_erro e ordenacao
  linhas?: OrdenacaoLinha[];
  indexErro?: number;

  // Para fluxograma
  condicao?: string;
  ramos?: FluxogramaRamo[];
  pergunta: string;
  resposta_correta: string | number;
  opcoes?: string[];
  prefixo?: string;
  sufixo?: string | string[];
  codigo?: string;
  infoQuestao?: InfoQuestao;
  nivel: Nivel;
  explicacao?: string;
}

export interface Tema {
  id: number;
  nome: string;
  nivel: Nivel;
}

export interface QuizData {
  tema: Tema;
  questoes: Questao[];
}

// a chave será QuizData.tema.id e o valor será QuizData
export interface Quizes {
  [key: number]: QuizData;
}
