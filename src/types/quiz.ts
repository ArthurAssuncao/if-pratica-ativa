import type { Level, QuestionType } from "./study";

export type StatusQuestao = "correta" | "errada" | "pendente";

export type Nivel = "iniciante" | "intermediário" | "avançado";

export type Amount = number | "Livre";

export interface QuizConfig {
  disciplineId: string | null;
  contentId: string | null;
  level?: Level;
  type?: QuestionType;
  amount?: Amount;
}

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

export type FluxogramaRamo = {
  id: string;
  label?: string;
  correta?: boolean;
  tipo?: "terminal" | "decisao";
  texto?: string;
};

export type ConexaoRamo = {
  de: string;
  para: string;
  label: string;
};

export type TipoQuiz = "automatico" | "manual";

export interface BaseQuestion {
  id: number;
  tipo: TipoQuestao;
  nivel: Nivel;
  infoQuestao?: InfoQuestao;
  pergunta: string;
  explicacao: string;
  respostaCorreta: string | number;
}

export interface QuestionClickOnError extends BaseQuestion {
  linhas: OrdenacaoLinha[];
}

export interface QuestionFillQuestion extends BaseQuestion {
  codigo: string;
}

export interface QuestionMultipleChoice extends BaseQuestion {
  opcoes: string[];
}

export interface QuestionOutput extends BaseQuestion {
  codigo: string;
}

export interface QuestionRearrange extends BaseQuestion {
  linhas: OrdenacaoLinha[];
}

export interface QuestionFlowchartnNew extends BaseQuestion {
  codigo: string;
  raiz: string;
  nos: FluxogramaRamo[];
  conexoes: ConexaoRamo[];
  respostaCorreta: string;
}

export type QuestionTypes =
  | QuestionClickOnError
  | QuestionFillQuestion
  | QuestionMultipleChoice
  | QuestionOutput
  | QuestionRearrange
  | QuestionFlowchartnNew;

export interface Tema {
  id: number;
  nome: string;
  nivel: Nivel;
}

export interface QuizData {
  tema: Tema;
  questoes: QuestionTypes[];
}

// a chave será QuizData.tema.id e o valor será QuizData
export interface Quizes {
  [key: number]: QuizData;
}
