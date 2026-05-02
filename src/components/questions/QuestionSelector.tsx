import { MarkdownSyntax } from "components/ui/MarkdownSyntax";
import { useState } from "react";
import type { BaseQuestionProps } from "types/question";
import type {
  Question,
  QuestionClickOnError,
  QuestionDeskCheck,
  QuestionFill,
  QuestionFlowchartnNew,
  QuestionMultipleChoice,
  QuestionOutput,
  QuestionRearrange,
} from "types/study";
import { ClickOnErrorQuestion } from "./ClickOnErrorQuestion";

import { DeskCheckingQuestion } from "./DeskCheckingQuestion";
import { FillQuestion } from "./FillQuestion";
import { FlowchartNewQuestion } from "./FlowchartNewQuestion";
import { MultipleChoiceQuestion } from "./MultipleChoiceQuestion";
import { OutputQuestion } from "./OutputQuestion";
import { RearrangeQuestion } from "./RearrangeQuestion";
import { TimeToAnswer } from "./util/TimeToAnswer";

interface QuestionSelectorProps extends BaseQuestionProps {
  data: Question;
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
    data: Question,
    onAnswer: BaseQuestionProps["onAnswer"],
  ) => {
    switch (data.type) {
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
            data={data as QuestionFill}
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
      case "teste_mesa":
        return (
          <DeskCheckingQuestion
            data={data as QuestionDeskCheck}
            onAnswer={onAnswer}
            isAbleToAnswer={isAbleToAnswer}
            disabled={isAnswered}
          />
        );
      default:
        return <span>{`Tipo ${data.type} de questão não encontrada`}</span>;
    }
  };

  const isBlocked = !isCurrentUnlocked && !isAbleToAnswer;

  const componente = getQuestionComponent(data, onAnswer);

  if (!componente) return null;

  return (
    <div className="flex flex-col relative">
      <TimeToAnswer
        key={data.id}
        onTimerEnd={() => handleTimerEnd()}
        countTimer={!isCurrentUnlocked}
      />

      <h2 className=" font-bold text-gray-700 dark:text-slate-200 mb-4">
        <MarkdownSyntax>{data.questionText}</MarkdownSyntax>
      </h2>

      {/* Container do componente */}
      <div className="relative group">
        {/* O Componente */}
        <div
          className={
            isBlocked || disabled
              ? "opacity-50 grayscale pointer-events-none"
              : ""
          }
        >
          {componente}
        </div>

        {(isBlocked || disabled) && (
          <div
            className="absolute inset-0 z-100 cursor-not-allowed bg-white/20"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          />
        )}
      </div>
    </div>
  );
};
