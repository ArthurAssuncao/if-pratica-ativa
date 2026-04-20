import { ButtonConfirm } from "components/ui/ButtonConfirm";
import { SyntaxHighlighterCustom } from "components/ui/SyntaxHighlighterCustom";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { BaseQuestionProps } from "types/question";
import { QuestionFillQuestion } from "types/quiz";
import { ajustarResposta } from "util/Quiz";
import { createQuestion } from "./QuestionFactory";
import { TimeToResponse } from "./util/TimeToResponse";

interface FillQuestionProps extends BaseQuestionProps {
  data: QuestionFillQuestion;
}

export const FillQuestion = createQuestion<
  FillQuestionProps,
  QuestionFillQuestion
>({
  validarResposta: ({ resposta, data }) => {
    const isRespostaCorreta =
      ajustarResposta(data.respostaCorreta) === resposta;
    return isRespostaCorreta;
  },

  Component: ({ data, aoResponder, validarResposta }) => {
    const [valor, setValor] = useState("");
    const [isAbleToRespond, setIsAbleToRespond] = React.useState(false);

    const handleConfirmar = () => {
      if (!isAbleToRespond) {
        toast.error("Você não pode responder ainda!");
        return;
      }

      const acertou = validarResposta({
        resposta: valor,
        data,
      });

      aoResponder(acertou);
    };

    return (
      <div className="flex flex-col gap-4">
        <TimeToResponse onTimerEnd={() => setIsAbleToRespond(true)} />
        <div className="bg-olive-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 p-6 rounded-lg font-mono flex flex-col">
          <SyntaxHighlighterCustom showLineNumbers={false}>
            {data.codigo || ""}
          </SyntaxHighlighterCustom>
        </div>
        <input
          autoFocus
          placeholder="Digite o que deveria estar no espaço em branco..."
          className="bg-olive-50 dark:bg-slate-900 border-olive-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 p-3 rounded-lg border outline-none focus:border-green-500 "
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleConfirmar()}
        />
        <ButtonConfirm onClick={handleConfirmar} disabled={!isAbleToRespond} />
      </div>
    );
  },
});
