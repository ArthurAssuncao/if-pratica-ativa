import { ButtonConfirm } from "components/ui/ButtonConfirm";
import { QuestionHint } from "components/ui/QuestionHint";
import { SyntaxHighlighterCustom } from "components/ui/SyntaxHighlighterCustom";
import React from "react";
import toast from "react-hot-toast";
import { BaseQuestionProps } from "types/question";
import { QuestionClickOnError } from "types/quiz";
import { createQuestion } from "./QuestionFactory";

interface ClickOnErrorQuestionProps extends BaseQuestionProps {
  data: QuestionClickOnError;
}

export const ClickOnErrorQuestion = createQuestion<
  ClickOnErrorQuestionProps,
  QuestionClickOnError
>({
  validateAnswer: ({ resposta, data }) => {
    return resposta === data.respostaCorreta.toString();
  },

  Component: ({ data, onAnswer, isAbleToAnswer, validateAnswer }) => {
    const [opcaoSelecionada, setOpcaoSelecionada] = React.useState(-1);

    const handleClick = (index: number) => {
      setOpcaoSelecionada(index);
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
        <div className="bg-olive-50 dark:bg-slate-900 border-olive-300 dark:border-slate-600 rounded-lg font-mono border">
          <div className="bg-yellow-50 dark:bg-blue-500/10 flex flex-col gap-2 p-4">
            {data.linhas?.map((linha, index) => (
              <button
                key={index}
                onClick={() => handleClick(index)}
                className={`text-slate-700 dark:text-blue-300 w-full text-left px-2 py-1 rounded hover:bg-green-500/20 hover:text-red-400 hover:cursor-pointer ${
                  opcaoSelecionada === index
                    ? "bg-green-500/10 text-red-400"
                    : ""
                } transition-colors group flex gap-4`}
              >
                <span className="border-r border-slate-700 pr-2 w-6">
                  {index + 1}
                </span>

                <SyntaxHighlighterCustom
                  showLineNumbers={false}
                  padding={0}
                  customStyle={{}}
                  className="group-hover:text-white"
                >
                  {linha.texto}
                </SyntaxHighlighterCustom>
              </button>
            ))}
          </div>
        </div>

        <QuestionHint>
          Clique na linha que contém um erro de sintaxe ou lógica.
        </QuestionHint>

        <ButtonConfirm
          onClick={handleConfirmar}
          disabled={!isAbleToAnswer || opcaoSelecionada < 0}
          label={
            opcaoSelecionada >= 0
              ? "Confirmar resposta"
              : "Você ainda não indicou o erro"
          }
        />
      </div>
    );
  },
});
