import type {
  BaseQuestion,
  ConectionNode,
  Content,
  Discipline,
  FlowchartNode,
  Level,
  QuestionType,
  RearrangeRow,
} from "./study";

export interface QuestionMetadata {
  options?: string[]; // Para múltipla escolha e verdadeiro/falso
  rows?: RearrangeRow[]; // Para ordenação e clique no erro
  nodes?: FlowchartNode[]; // Para fluxogramas
  connections?: ConectionNode[]; // Para fluxogramas
  root?: string; // Para o nó raiz do fluxograma
  code?: string; // Para preenchimento de código
}
// content_id	type	level	question_text	correct_answer	explanation	metadata
export type BaseQuestionDatabase = Omit<
  BaseQuestion,
  "questionText" | "correctAnswer"
> & {
  question_text: string;
  correct_answer: string;
  metadata?: QuestionMetadata;
};

export interface QuestionDatabase extends BaseQuestion {
  metadata?: QuestionMetadata;
}

export type DisciplineDatabase = Omit<Discipline, "iconSlug"> & {
  icon_slug: string;
};

export type ContentDatabase = Content;

export type ContentWithQuestionsDatabase = {
  id: string;
  content_level: Level;
  content_name: string;
  correct_answer: string;
  discipline_id: string;
  explanation?: string;
  metadata: QuestionMetadata;
  order: number;
  question_id: number;
  question_level: Level;
  question_text: string;
  slug: string;
  type: QuestionType;
};
