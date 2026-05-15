import { CheckCircle2, XCircle } from "lucide-react";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../constants/messages";
import type { CorrectAnswer } from "../../types/study";
import { generateRandomIndex } from "../../util/util";

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
        <p className="text-sm opacity-80 text-slate-700 dark:text-slate-200">
          Resposta correta:{" "}
          <span className="font-mono font-bold">
            {Array.isArray(respostaCorreta)
              ? respostaCorreta.join(" e ")
              : respostaCorreta}
          </span>
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
