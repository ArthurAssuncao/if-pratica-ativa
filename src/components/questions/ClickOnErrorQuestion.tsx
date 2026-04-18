import { SyntaxHighlighterCustom } from "components/ui/SyntaxHighlighterCustom";
import React from "react";
import toast from "react-hot-toast";
import { BaseQuestionProps } from "types/question";
import { TimeToResponse } from "./util/TimeToResponse";

export const ClickOnErrorQuestion = ({
  data,
  aoResponder,
}: BaseQuestionProps) => {
  const [isAbleToRespond, setIsAbleToRespond] = React.useState(false);
  const [opcaoSelecionada, setOpcaoSelecionada] = React.useState(-1);

  const handleClick = (index: number) => {
    setOpcaoSelecionada(index);
  };

  const handleConfirmar = () => {
    if (isAbleToRespond) {
      aoResponder(opcaoSelecionada.toString());
      return;
    }
    toast.error("Você não pode responder ainda!");
  };

  return (
    <div className="flex flex-col gap-4">
      <TimeToResponse onTimerEnd={() => setIsAbleToRespond(true)} />

      <div className="bg-olive-50 dark:bg-slate-900 border-olive-300 dark:border-slate-600  rounded-lg font-mono border ">
        <div className="bg-yellow-50 dark:bg-blue-500/10 flex flex-col gap-2 p-4">
          {data.linhas?.map((linha, index) => (
            <button
              key={index}
              onClick={() => handleClick(index)}
              className={`text-slate-700 dark:text-blue-300 w-full text-left px-2 py-1 rounded hover:bg-green-500/20  hover:text-red-400 ${opcaoSelecionada === index ? "bg-green-500/10 text-red-400" : ""} transition-colors group flex gap-4 hover:cursor-pointer`}
            >
              <span className="border-r border-slate-700 pr-2 w-6">
                {index + 1}
              </span>
              <SyntaxHighlighterCustom
                showLineNumbers={false}
                padding={0}
                className={` group-hover:text-white pl-${linha.identationLevel * 2}px `}
              >
                {linha.texto}
              </SyntaxHighlighterCustom>
            </button>
          ))}
        </div>
      </div>
      <p className=" lg:text-sm text-slate-500 italic">
        Dica: Clique na linha que contém um erro de sintaxe ou lógica.
      </p>
      <button
        disabled={opcaoSelecionada >= 0}
        onClick={handleConfirmar}
        className={` border-olive-400 dark:border-slate-700 border w-full p-3 rounded-lg font-bold transition-all cursor-pointer ${
          opcaoSelecionada >= 0
            ? "bg-green-600 text-white hover:bg-green-500 shadow-lg"
            : "bg-slate-200 text-slate-400 dark:bg-slate-800 cursor-not-allowed"
        }`}
      >
        {opcaoSelecionada >= 0
          ? "Confirmar resposta"
          : `Você ainda não indicou o erro`}
      </button>
    </div>
  );
};
