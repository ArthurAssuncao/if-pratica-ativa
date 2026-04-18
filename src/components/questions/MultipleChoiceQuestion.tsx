import React from "react";
import toast from "react-hot-toast";
import { BaseQuestionProps } from "types/question";
import { getLetraByIndex } from "util/Quiz";
import { TimeToResponse } from "./util/TimeToResponse";

export const MultipleChoiceQuestion: React.FC<BaseQuestionProps> = ({
  data,
  aoResponder,
}) => {
  const [isAbleToRespond, setIsAbleToRespond] = React.useState(false);

  const handleClick = (opt: string) => {
    if (isAbleToRespond) {
      aoResponder(opt);
      return;
    }
    toast.error("Você não pode responder ainda!");
  };

  return (
    <div className="grid gap-3">
      <TimeToResponse onTimerEnd={() => setIsAbleToRespond(true)} />
      <div className="bg-olive-50 dark:bg-slate-900 border-olive-300 dark:border-slate-600 p-4 rounded-lg font-mono text-sm border  flex flex-col gap-2">
        {data.opcoes?.map((opt, index) => (
          <button
            key={opt}
            onClick={() => handleClick(opt)}
            className="p-4 text-left border text-slate-700 dark:text-blue-300 border-olive-400 dark:border-slate-700 bg-yellow-50 dark:bg-blue-500/10 rounded-xl hover:bg-green-500/10 hover:border-green-500 transition-colors  hover:cursor-pointer"
          >
            {getLetraByIndex(index) + ") "}
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};
