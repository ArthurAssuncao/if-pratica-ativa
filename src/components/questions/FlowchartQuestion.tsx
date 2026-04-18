import { SyntaxHighlighterCustom } from "components/ui/SyntaxHighlighterCustom";
import React from "react";
import toast from "react-hot-toast";
import { BaseQuestionProps } from "types/question";
import { TimeToResponse } from "./util/TimeToResponse";

export const FlowchartQuestion = ({ data, aoResponder }: BaseQuestionProps) => {
  const [isAbleToRespond, setIsAbleToRespond] = React.useState(false);

  const handleClick = (ramoLabel: string) => {
    if (isAbleToRespond) {
      aoResponder(ramoLabel);
      return;
    }
    toast.error("Você não pode responder ainda!");
  };
  return (
    <div className="flex flex-col gap-6 items-center">
      <TimeToResponse onTimerEnd={() => setIsAbleToRespond(true)} />
      <div className="bg-olive-50 dark:bg-slate-900 border-olive-300 dark:border-slate-600 text-slate-700 dark:text-blue-300 border p-4 rounded-lg text-sm  w-full flex flex-col gap-1">
        {data.codigo && (
          <>
            <strong>Código base:</strong>
            <SyntaxHighlighterCustom>{data.codigo}</SyntaxHighlighterCustom>
          </>
        )}
      </div>
      {!data.codigo && <span>Nenhum código foi fornecido.</span>}

      {/* Representação visual simplificada do IF */}
      <div className="bg-olive-50 dark:bg-slate-900 border-olive-300 dark:border-slate-600 border p-8 relative flex flex-col items-center gap-4 rounded-xl w-full">
        <div className="text-slate-700 dark:text-blue-300 border-olive-400 dark:border-slate-700 bg-yellow-50 dark:bg-blue-500/10 border p-4 rotate-45 w-32 h-32 flex items-center justify-center text-center">
          <span className="-rotate-45 text-sm font-bold font-mono text-center">
            <SyntaxHighlighterCustom showLineNumbers={false}>
              {data.condicao || ""}
            </SyntaxHighlighterCustom>
          </span>
        </div>

        <div className="grid grid-cols-2 gap-20 mt-4 w-full">
          {data.ramos?.map((ramo) => (
            <button
              key={ramo.id}
              onClick={() => handleClick(ramo.label)}
              className="text-slate-700 dark:text-blue-300 border-olive-400 dark:border-slate-700 bg-yellow-50 dark:bg-blue-500/10 hover:border-green-500 hover:bg-yellow-100 dark:hover:bg-blue-500/30 p-4  rounded-xl  border t transition-all flex flex-col items-center gap-2 hover:cursor-pointer"
            >
              <span className="font-bold text-blue-400">{ramo.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
