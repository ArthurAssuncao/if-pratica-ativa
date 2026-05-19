import { CheckCircle2, XCircle } from "lucide-react";
import { INDENTATION_SIZE } from "../../constants/general";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../constants/messages";
import type { CorrectAnswer } from "../../types/study";
import { getAnswer } from "../../util/answer";
import { generateRandomIndex } from "../../util/util";
import MarkdownRenderer from "../lesson/MarkdownRender";

interface FeedbackProps {
  status: "correto" | "errado";
  respostaCorreta: CorrectAnswer;
  explanation?: string;
}

export const Feedback = ({
  status,
  respostaCorreta,
  explanation,
}: FeedbackProps) => {
  const randomIndexSuccess = generateRandomIndex(SUCCESS_MESSAGES.length);
  const randomIndexError = generateRandomIndex(ERROR_MESSAGES.length);

  return (
    <div
      className={`p-6 rounded-lg flex items-center gap-4 animate-in fade-in zoom-in duration-300 ${
        status === "correto"
          ? "bg-green-500/10 border border-green-500"
          : "bg-red-500/10 border border-red-500"
      }`}
    >
      {status === "correto" ? (
        <CheckCircle2 className="text-green-500" size={40} />
      ) : (
        <XCircle className="text-red-500" size={40} />
      )}
      <div>
        <p className="font-bold text-lg text-slate-700 dark:text-slate-200">
          {status === "correto"
            ? SUCCESS_MESSAGES[randomIndexSuccess]
            : ERROR_MESSAGES[randomIndexError]}
        </p>
        <p className="text-sm opacity-80 text-slate-700 dark:text-slate-200 flex gap-2 flex-col">
          Resposta correta:{" "}
          <div className="border border-slate-200 p-2 rounded-lg bg-yellow-50">
            <MarkdownRenderer insideArticle={false}>
              {getAnswer(respostaCorreta)
                .replaceAll("\n", "\n\r")
                .replaceAll("\t", "&nbsp;".repeat(INDENTATION_SIZE))}
            </MarkdownRenderer>
          </div>
        </p>
        {explanation && (
          <p className="text-sm opacity-80 text-slate-700 dark:text-slate-200">
            Explicação: <span className="">{explanation}</span>
          </p>
        )}
      </div>
    </div>
  );
};
