import { ButtonConfirm } from "components/ui/ButtonConfirm";
import React from "react";
import toast from "react-hot-toast";
import type { BaseQuestionProps } from "types/question";
import type { QuestionMultipleChoice } from "types/study";
import { getLetraByIndex } from "util/Quiz";
import { createQuestion } from "./QuestionFactory";

interface MultipleChoiceQuestionProps extends BaseQuestionProps {
  data: QuestionMultipleChoice;
}

export const MultipleChoiceQuestion = createQuestion<
  MultipleChoiceQuestionProps,
  QuestionMultipleChoice
>({
  validateAnswer: ({ resposta, data }) => {
    return resposta === data.correctAnswer.toString();
  },

  Component: ({ data, onAnswer, isAbleToAnswer, validateAnswer }) => {
    const [optionSelected, setOptionSelected] = React.useState("");

    const handleConfirmar = () => {
      if (!isAbleToAnswer) {
        toast.error("Você não pode responder ainda!");
        return;
      }

      const acertou = validateAnswer({
        resposta: optionSelected.toString(),
        data,
      });

      onAnswer(acertou, data.id);
    };

    return (
      <div className="grid gap-4">
        <div className="md:bg-olive-50 md:dark:bg-slate-900 md:p-4 md:border border-olive-300 dark:border-slate-600  rounded-lg font-mono   flex flex-col gap-4">
          {data.options?.map((opt, index) => (
            <button
              key={opt}
              onClick={() => setOptionSelected(opt)}
              className={`p-4 text-sm text-left border text-slate-700 dark:text-blue-300 border-olive-400 dark:border-slate-700  rounded-lg hover:bg-green-500/10 hover:border-green-500 transition-colors  hover:cursor-pointer ${optionSelected === opt ? "bg-green-500/20" : "bg-yellow-50 dark:bg-blue-500/10"}`}
            >
              {getLetraByIndex(index) + ") "}
              {opt}
            </button>
          ))}
        </div>
        <ButtonConfirm
          onClick={handleConfirmar}
          disabled={!isAbleToAnswer || optionSelected === ""}
          disabledText="Escolha uma opção"
        />
      </div>
    );
  },
});
