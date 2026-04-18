import { Questao } from "./quiz";

// Interface base compartilhada
export interface BaseQuestionProps {
  data: Questao;
  aoResponder: (resp: string) => void;
}
