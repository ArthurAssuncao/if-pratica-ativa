import { CheckCircle2, XCircle } from "lucide-react";

interface FeedbackProps {
  status: "correto" | "errado";
  respostaCorreta: string | number;
}

export const Feedback = ({ status, respostaCorreta }: FeedbackProps) => (
  <div
    className={`p-6 rounded-xl flex items-center gap-4 animate-in fade-in zoom-in duration-300 ${
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
        {status === "correto" ? "Excelente!" : "Não foi dessa vez..."}
      </p>
      <p className="text-sm opacity-80 text-slate-700 dark:text-slate-200">
        Resposta correta:{" "}
        <span className="font-mono font-bold">{respostaCorreta}</span>
      </p>
    </div>
  </div>
);
