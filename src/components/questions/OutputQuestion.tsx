import { ButtonConfirm } from "components/ui/ButtonConfirm";
import { QuestionHint } from "components/ui/QuestionHint";
import { SyntaxHighlighterCustom } from "components/ui/SyntaxHighlighterCustom";
import { useState } from "react";
import toast from "react-hot-toast";
import type { BaseQuestionProps } from "types/question";
import type { QuestionOutput } from "types/study";
import { ajustarResposta } from "util/Quiz";
import { createQuestion } from "./QuestionFactory";

interface OutputQuestionProps extends BaseQuestionProps {
  data: QuestionOutput;
}

export const OutputQuestion = createQuestion<
  OutputQuestionProps,
  QuestionOutput
>({
  validateAnswer: ({ resposta, data }) => {
    return ajustarResposta(resposta) === ajustarResposta(data.correctAnswer);
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
      <div className="flex flex-col gap-4 ">
        <div className="bg-yellow-50 dark:bg-blue-500/10 border-olive-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 p-4 rounded-lg  font-mono leading-relaxed overflow-x-auto border">
          <SyntaxHighlighterCustom className="">
            {data.code || ""}
          </SyntaxHighlighterCustom>
        </div>
        <input
          placeholder="Digite a saída do console..."
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
