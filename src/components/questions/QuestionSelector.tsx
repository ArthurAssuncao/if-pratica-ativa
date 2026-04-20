import { BaseQuestionProps } from "types/question";
import {
  QuestionClickOnError,
  QuestionFillQuestion,
  QuestionFlowchartnNew,
  QuestionMultipleChoice,
  QuestionOutput,
  QuestionRearrange,
  QuestionTypes,
} from "types/quiz";
import { ClickOnErrorQuestion } from "./ClickOnErrorQuestion";
import { FillQuestion } from "./FillQuestion";
import { FlowchartNewQuestion } from "./FlowchartNewQuestion";
import { MultipleChoiceQuestion } from "./MultipleChoiceQuestion";
import { OutputQuestion } from "./OutputQuestion";
import { RearrangeQuestion } from "./RearrangeQuestion";

interface QuestionSelectorProps extends BaseQuestionProps {
  data: QuestionTypes;
  respondido: boolean;
}

export const QuestionSelector = ({
  data,
  aoResponder,
  respondido,
}: QuestionSelectorProps) => {
  const getQuestionComponent = (
    data: QuestionTypes,
    aoResponder: BaseQuestionProps["aoResponder"],
  ) => {
    switch (data.tipo) {
      case "multipla_escolha":
      case "verdadeiro_falso":
        return (
          <MultipleChoiceQuestion
            data={data as QuestionMultipleChoice}
            aoResponder={aoResponder}
          />
        );
      case "lacuna":
        return (
          <FillQuestion
            data={data as QuestionFillQuestion}
            aoResponder={aoResponder}
          />
        );
      case "predicao":
        return (
          <OutputQuestion
            data={data as QuestionOutput}
            aoResponder={aoResponder}
          />
        );
      case "ordenacao":
        return (
          <RearrangeQuestion
            data={data as QuestionRearrange}
            aoResponder={aoResponder}
          />
        );
      case "clique_erro":
        return (
          <ClickOnErrorQuestion
            data={data as QuestionClickOnError}
            aoResponder={aoResponder}
          />
        );
      case "fluxograma_novo":
        return (
          <FlowchartNewQuestion
            data={data as QuestionFlowchartnNew}
            aoResponder={aoResponder}
          />
        );
      default:
        return null;
    }
  };

  const componente = getQuestionComponent(data, aoResponder);

  if (!componente) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className={`${respondido ? "" : ""}`}>{componente}</div>
    </div>
  );
};
