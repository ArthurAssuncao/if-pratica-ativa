import { ButtonConfirm } from "components/ui/ButtonConfirm";
import React from "react";
import toast from "react-hot-toast";
import { BaseQuestionProps } from "types/question";
import { QuestionMultipleChoice } from "types/quiz";
import { getLetraByIndex } from "util/Quiz";
import { createQuestion } from "./QuestionFactory";
import { TimeToResponse } from "./util/TimeToResponse";

interface MultipleChoiceQuestionProps extends BaseQuestionProps {
  data: QuestionMultipleChoice;
}

export const MultipleChoiceQuestion = createQuestion<
  MultipleChoiceQuestionProps,
  QuestionMultipleChoice
>({
  validarResposta: ({ resposta, data }) => {
    return resposta === data.respostaCorreta.toString();
  },

  Component: ({ data, aoResponder, validarResposta }) => {
    const [isAbleToRespond, setIsAbleToRespond] = React.useState(false);
    const [optionSelected, setOptionSelected] = React.useState("");

    const handleConfirmar = () => {
      if (!isAbleToRespond) {
        toast.error("Você não pode responder ainda!");
        return;
      }

      const acertou = validarResposta({
        resposta: optionSelected.toString(),
        data,
      });

      aoResponder(acertou);
    };

    return (
      <div className="grid gap-3">
        <TimeToResponse onTimerEnd={() => setIsAbleToRespond(true)} />
        <div className="bg-olive-50 dark:bg-slate-900 border-olive-300 dark:border-slate-600 p-4 rounded-lg font-mono border  flex flex-col gap-2">
          {data.opcoes?.map((opt, index) => (
            <button
              key={opt}
              onClick={() => setOptionSelected(opt)}
              className={`p-4 text-left border text-slate-700 dark:text-blue-300 border-olive-400 dark:border-slate-700  rounded-xl hover:bg-green-500/10 hover:border-green-500 transition-colors  hover:cursor-pointer ${optionSelected === opt ? "bg-green-500/20" : "bg-yellow-50 dark:bg-blue-500/10"}`}
            >
              {getLetraByIndex(index) + ") "}
              {opt}
            </button>
          ))}
        </div>
        <ButtonConfirm onClick={handleConfirmar} disabled={!isAbleToRespond} />
      </div>
    );
  },
});
