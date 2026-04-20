import { useState } from "react";
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
import { TimeToAnswer } from "./util/TimeToAnswer";

interface QuestionSelectorProps extends BaseQuestionProps {
  data: QuestionTypes;
}

export const QuestionSelector = ({
  data,
  disabled,
  onAnswer,
}: QuestionSelectorProps) => {
  const [isAbleToAnswer, setisAbleToAnswer] = useState(false);
  const isAnswered = disabled;
  const [unlockedQuestions, setUnlockedQuestions] = useState<Set<number>>(
    new Set(),
  );
  const isCurrentUnlocked = unlockedQuestions.has(data.id);

  const handleTimerEnd = () => {
    setUnlockedQuestions((prev) => new Set(prev).add(data.id));
    setisAbleToAnswer(true);
  };

  const getQuestionComponent = (
    data: QuestionTypes,
    onAnswer: BaseQuestionProps["onAnswer"],
  ) => {
    switch (data.tipo) {
      case "multipla_escolha":
      case "verdadeiro_falso":
        return (
          <MultipleChoiceQuestion
            data={data as QuestionMultipleChoice}
            onAnswer={onAnswer}
            isAbleToAnswer={isAbleToAnswer}
            disabled={isAnswered}
          />
        );
      case "lacuna":
        return (
          <FillQuestion
            data={data as QuestionFillQuestion}
            onAnswer={onAnswer}
            isAbleToAnswer={isAbleToAnswer}
            disabled={isAnswered}
          />
        );
      case "predicao":
        return (
          <OutputQuestion
            data={data as QuestionOutput}
            onAnswer={onAnswer}
            isAbleToAnswer={isAbleToAnswer}
            disabled={isAnswered}
          />
        );
      case "ordenacao":
        return (
          <RearrangeQuestion
            data={data as QuestionRearrange}
            onAnswer={onAnswer}
            isAbleToAnswer={isAbleToAnswer}
            disabled={isAnswered}
          />
        );
      case "clique_erro":
        return (
          <ClickOnErrorQuestion
            data={data as QuestionClickOnError}
            onAnswer={onAnswer}
            isAbleToAnswer={isAbleToAnswer}
            disabled={isAnswered}
          />
        );
      case "fluxograma_novo":
        return (
          <FlowchartNewQuestion
            data={data as QuestionFlowchartnNew}
            onAnswer={onAnswer}
            isAbleToAnswer={isAbleToAnswer}
            disabled={isAnswered}
          />
        );
      default:
        return null;
    }
  };

  const componente = getQuestionComponent(data, onAnswer);

  if (!componente) return null;

  return (
    <div className="flex flex-col gap-4">
      <TimeToAnswer
        key={data.id}
        onTimerEnd={() => handleTimerEnd()}
        countTimer={!isCurrentUnlocked}
      />

      {/* Container do componente */}
      <div className="relative group">
        {/* O Componente */}
        <div
          className={
            !isAbleToAnswer || disabled
              ? "opacity-50 grayscale transition-all"
              : "transition-all"
          }
        >
          {componente}
        </div>

        {!isAbleToAnswer ||
          (disabled && (
            <div
              className="absolute inset-0 z-10 cursor-not-allowed bg-white/20 dark:bg-white/20"
              onClick={(e) => e.stopPropagation()}
            />
          ))}
      </div>
    </div>
  );
};
