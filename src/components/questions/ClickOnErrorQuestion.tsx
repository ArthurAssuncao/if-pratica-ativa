import { ButtonConfirm } from "components/ui/ButtonConfirm";
import { Hint } from "components/ui/Hint";
import { SyntaxHighlighterCustom } from "components/ui/SyntaxHighlighterCustom";
import React from "react";
import toast from "react-hot-toast";
import type { BaseQuestionProps } from "types/question";
import type { QuestionClickOnError } from "types/study";
import { generateIndentation } from "../../constants/general";
import { createQuestion } from "./QuestionFactory";

interface ClickOnErrorQuestionProps extends BaseQuestionProps {
  data: QuestionClickOnError;
}

export const ClickOnErrorQuestion = createQuestion<
  ClickOnErrorQuestionProps,
  QuestionClickOnError
>({
  validateAnswer: ({ resposta, data }) => {
    if ("text" in data.correctAnswer && data.correctAnswer.text) {
      return resposta === data.correctAnswer.text.toString();
    }
    return resposta === data.correctAnswer.option.toString();
  },

  Component: ({ data, onAnswer, isAbleToAnswer, validateAnswer }) => {
    const [opcaoSelecionada, setOpcaoSelecionada] = React.useState("");

    const handleClick = (index: number) => {
      setOpcaoSelecionada(data.rows[index].text);
    };

    const handleConfirmar = () => {
      if (!isAbleToAnswer) {
        toast.error("Você não pode responder ainda!");
        return;
      }

      const acertou = validateAnswer({
        resposta: opcaoSelecionada.toString(),
        data,
      });

      onAnswer(acertou, data.id);
    };

    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col bg-olive-50 dark:bg-slate-900 border-olive-300 dark:border-slate-600 rounded-lg font-mono border">
          <span className="text-[10px] bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-100 px-2 py-1 rounded-t-lg font-bold ">
            {data.language}
          </span>
          <div className="bg-yellow-50 dark:bg-blue-500/10 flex flex-col gap-0 p-2">
            {data.rows?.map((row, index) => (
              <button
                key={"ClickOnErrorQuestion" + index}
                onClick={() => handleClick(index)}
                className={`text-slate-700 dark:text-blue-300 w-full text-left px-2 leading-10 border border-dashed border-slate-200 hover:bg-green-500/20 hover:text-red-400 hover:cursor-pointer ${
                  opcaoSelecionada === row.text
                    ? "bg-green-500/10 text-red-400"
                    : ""
                } ${index === 0 ? "rounded-t-lg" : ""} ${index === data.rows.length - 1 ? "rounded-b-lg" : ""} transition-colors group flex gap-4`}
              >
                <span className="border-r border-slate-700 pr-2 w-6">
                  {index + 1}
                </span>

                <SyntaxHighlighterCustom
                  showLineNumbers={false}
                  padding={0}
                  customStyle={{}}
                  className="group-hover:text-white"
                  language={data.language}
                >
                  {generateIndentation(row.identationLevel) + row.text}
                </SyntaxHighlighterCustom>
              </button>
            ))}
          </div>
        </div>

        <Hint>Clique na linha que contém um erro de sintaxe ou lógica.</Hint>

        <ButtonConfirm
          onClick={handleConfirmar}
          disabled={!isAbleToAnswer || opcaoSelecionada == ""}
          label={
            opcaoSelecionada !== ""
              ? "Confirmar resposta"
              : "Você ainda não indicou o erro"
          }
        />
      </div>
    );
  },
});
