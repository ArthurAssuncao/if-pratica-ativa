import { ButtonConfirm } from "components/ui/ButtonConfirm";
import { QuestionHint } from "components/ui/QuestionHint";
import { SyntaxHighlighterCustom } from "components/ui/SyntaxHighlighterCustom";
import { useState } from "react";
import toast from "react-hot-toast";
import type { BaseQuestionProps } from "types/question";
import type { QuestionFill } from "types/study";
import { ajustarResposta } from "util/Quiz";
import { createQuestion } from "./QuestionFactory";

interface FillQuestionProps extends BaseQuestionProps {
  data: QuestionFill;
}

export const FillQuestion = createQuestion<FillQuestionProps, QuestionFill>({
  validateAnswer: ({ resposta, data }) => {
    const isRespostaCorreta =
      ajustarResposta(data.correctAnswer) === ajustarResposta(resposta);
    return isRespostaCorreta;
  },

  Component: ({ data, onAnswer, isAbleToAnswer, validateAnswer }) => {
    const [resposta, setResposta] = useState("");

    const handleConfirmar = () => {
      if (!isAbleToAnswer) {
        toast.error("Você não pode responder ainda!");
        return;
      }

      const acertou = validateAnswer({
        resposta: resposta,
        data,
      });

      onAnswer(acertou, data.id);
    };

    return (
      <div className="flex flex-col gap-4">
        <div className="bg-olive-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 p-4 rounded-lg font-mono flex flex-col">
          <SyntaxHighlighterCustom showLineNumbers={true}>
            {data.code || ""}
          </SyntaxHighlighterCustom>
        </div>
        <input
          autoFocus
          placeholder="Digite o que deveria estar no espaço em branco..."
          className="bg-olive-50 dark:bg-slate-900 border-olive-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 p-3 rounded-lg border outline-none focus:border-green-500 "
          value={resposta}
          onChange={(e) => setResposta(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleConfirmar()}
        />
        <QuestionHint>
          A resposta não diferencia maiúsculas de minúsculas.
        </QuestionHint>
        <ButtonConfirm
          onClick={handleConfirmar}
          disabled={!isAbleToAnswer || resposta === ""}
          disabledText="Digite uma resposta"
        />
      </div>
    );
  },
});
