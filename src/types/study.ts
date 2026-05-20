import type { LANGUAGES } from "../constants/code";

export type Level = "iniciante" | "intermediário" | "avançado";

export type QuestionType =
  | "multipla_escolha"
  | "verdadeiro_falso"
  | "lacuna"
  | "predicao"
  | "clique_erro"
  | "ordenacao"
  | "fluxograma"
  | "fluxograma_novo"
  | "teste_mesa";

export type RearrangeRow = { text: string; identationLevel: number };

export type Languages = (typeof LANGUAGES)[number];

export type FlowchartNodeType = "processo" | "terminal" | "decisao";

export type FlowchartNode = {
  id: string;
  label?: string;
  type: FlowchartNodeType;
  text: string;
};

export type ConectionNode = {
  from: string;
  to: string;
  label: string;
};

export interface Slot {
  id: string;
  label: string;
  type: "NUMBER" | "STRING" | "BOOLEAN" | "OUTPUT";
  expected: string;
}

export interface Checkpoint {
  step: number;
  description: string;
  lineReference: number[];
  iteration?: number;
  slots: Slot[];
}

export type QuestionStatus = "correta" | "errada" | "pendente";

export interface QuestionInfo {
  status: QuestionStatus;
  attemptCount: number;
}

export type CorrectAnswer = {
  option: number | string | string[] | number[];
  text?: string;
};

export interface BaseQuestion {
  id: number;
  type: QuestionType;
  level: Level;
  questionText: string;
  explanation: string;
  correctAnswer: CorrectAnswer;
  info: QuestionInfo;
  language: Languages;
}

export interface QuestionDeskCheck extends BaseQuestion {
  code: string;
  checkpoints: Checkpoint[];
}

export interface QuestionClickOnError extends BaseQuestion {
  rows: RearrangeRow[];
}

export interface QuestionFill extends BaseQuestion {
  code: string;
  language: Languages;
}

export interface QuestionMultipleChoice extends BaseQuestion {
  options: string[];
}

export interface QuestionOutput extends BaseQuestion {
  code: string;
}

export interface QuestionRearrange extends BaseQuestion {
  rows: RearrangeRow[];
}

export interface QuestionFlowchartnNew extends BaseQuestion {
  code: string;
  root: string;
  nodes: FlowchartNode[];
  connections: ConectionNode[];
}

export type Question =
  | QuestionClickOnError
  | QuestionFill
  | QuestionMultipleChoice
  | QuestionOutput
  | QuestionRearrange
  | QuestionFlowchartnNew;

export interface Content {
  id: string;
  name: string;
  level: Level;
  questions: Question[];
}

export interface Discipline {
  id: string;
  name: string;
  iconSlug: string;
}

export interface SavedProgress {
  disciplineId: string;
  disciplineName: string;
  contentId: string;
  contentName: string;
  remaining: number;
}

export interface Quiz {
  questions: Question[];
  contentName: string;
  discipline: Discipline | null;
  isReady: boolean;
  total: number;
}
