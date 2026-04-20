// Interface base compartilhada
export interface BaseQuestionProps {
  onAnswer: (correto: boolean) => void;
  isAbleToAnswer: boolean;
  disabled: boolean;
}

export type QuestionComponent<T extends BaseQuestionProps> = {
  validateAnswer: () => boolean;
  Component: React.FC<T>;
};

export interface FlowNode {
  id: string;
  tipo: "decisao" | "terminal";
  texto: string;
  correta?: boolean;
}

export interface FlowConnection {
  de: string;
  para: string;
  label: string;
}
