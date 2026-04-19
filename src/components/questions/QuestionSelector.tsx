import { BaseQuestionProps } from "types/question";
import { ClickOnErrorQuestion } from "./ClickOnErrorQuestion";
import { FillQuestion } from "./FillQuestion";
import { FlowchartQuestion } from "./FlowchartQuestion";
import { FlowchartQuestionNew } from "./FlowchartQuestionNew";
import { MultipleChoiceQuestion } from "./MultipleChoiceQuestion";
import { OutputQuestion } from "./OutputQuestion";
import { RearrangeQuestion } from "./RearrangeQuestion";

export const QuestionSelector = ({ data, aoResponder }: BaseQuestionProps) => {
  switch (data.tipo) {
    case "multipla_escolha":
    case "verdadeiro_falso":
      return <MultipleChoiceQuestion data={data} aoResponder={aoResponder} />;
    case "lacuna":
      return <FillQuestion data={data} aoResponder={aoResponder} />;
    case "predicao":
      return <OutputQuestion data={data} aoResponder={aoResponder} />;
    case "ordenacao":
      return <RearrangeQuestion data={data} aoResponder={aoResponder} />;
    case "clique_erro":
      return <ClickOnErrorQuestion data={data} aoResponder={aoResponder} />;
    case "fluxograma":
      return <FlowchartQuestion data={data} aoResponder={aoResponder} />;
    case "fluxograma_novo":
      return <FlowchartQuestionNew data={data} aoResponder={aoResponder} />;
    default:
      return null;
  }
};
