// Interface base compartilhada
export interface BaseQuestionProps {
  aoResponder: (correto: boolean) => void;
}

export type QuestionComponent<T extends BaseQuestionProps> = {
  validarResposta: () => boolean;
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
