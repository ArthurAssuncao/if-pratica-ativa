import { SyntaxHighlighterCustom } from "components/ui/SyntaxHighlighterCustom";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { BaseQuestionProps } from "types/question";
import { TimeToResponse } from "./util/TimeToResponse";

export const OutputQuestion: React.FC<BaseQuestionProps> = ({
  data,
  aoResponder,
}) => {
  const [valor, setValor] = useState("");

  const [isAbleToRespond, setIsAbleToRespond] = React.useState(false);

  const handleEnviar = () => {
    if (isAbleToRespond && valor.trim()) {
      aoResponder(valor.trim());
      return;
    }

    toast.error("Você não pode responder ainda!");
  };

  return (
    <div className="flex flex-col gap-4">
      <TimeToResponse onTimerEnd={() => setIsAbleToRespond(true)} />
      <pre className="bg-olive-50 dark:bg-slate-900 border-olive-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 p-4 rounded-lg  font-mono leading-relaxed overflow-x-auto border">
        <SyntaxHighlighterCustom showLineNumbers={false}>
          {data.codigo || ""}
        </SyntaxHighlighterCustom>
      </pre>
      <input
        placeholder="Digite a saída do console..."
        className="bg-olive-50 dark:bg-slate-900 border-olive-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 p-3 rounded-lg border outline-none focus:border-green-500 "
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleEnviar()}
      />
      <button
        onClick={handleEnviar}
        className="bg-green-600 hover:bg-green-500 p-3 rounded-lg font-bold text-white transition-colors"
      >
        Enviar Resposta
      </button>
    </div>
  );
};
