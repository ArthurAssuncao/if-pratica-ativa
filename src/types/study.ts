export type Level = "iniciante" | "intermediário" | "avançado";

export type QuestionType =
  | "multipla_escolha"
  | "verdadeiro_falso"
  | "lacuna"
  | "predicao"
  | "clique_erro"
  | "ordenacao"
  | "fluxograma"
  | "fluxograma_novo";

export type RearrangeRow = { text: string; identationLevel: number };

export type FlowchartNode = {
  id: string;
  label?: string;
  isCorrect?: boolean;
  type?: "terminal" | "decisao";
  text?: string;
};

export type ConectionNode = {
  from: string;
  to: string;
  label: string;
};

export type QuestionStatus = "correta" | "errada" | "pendente";

export interface QuestionInfo {
  status: QuestionStatus;
  attemptCount: number;
}

export interface QuestionMetadata {
  options?: string[]; // Para múltipla escolha e verdadeiro/falso
  rows?: RearrangeRow; // Para ordenação e clique no erro
  nodes?: FlowchartNode; // Para fluxogramas
  connections?: ConectionNode; // Para fluxogramas
  root?: string; // Para o nó raiz do fluxograma
}

export interface BaseQuestion {
  id: number;
  type: QuestionType;
  level: Level;
  questionText: string;
  explanation: string;
  correctAnswer: string | number;
  info: QuestionInfo;
  metadata?: QuestionMetadata;
}

export interface QuestionClickOnError extends BaseQuestion {
  rows: RearrangeRow[];
}

export interface QuestionFillQuestion extends BaseQuestion {
  code: string;
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
  conections: ConectionNode[];
}

export type Question =
  | QuestionClickOnError
  | QuestionFillQuestion
  | QuestionMultipleChoice
  | QuestionOutput
  | QuestionRearrange
  | QuestionFlowchartnNew;

export interface Content {
  id: string;
  name: string;
  level: Level;
  questions?: Question[];
}

export interface Discipline {
  id: string;
  name: string;
  icon: React.ReactNode;
  contents: Content[];
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
