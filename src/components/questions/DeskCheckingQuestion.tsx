import { PlayCircle, Terminal } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import type { BaseQuestionProps } from "../../types/question";
import type { QuestionDeskCheck } from "../../types/study";
import { compareArrays, stringToArrayNumber } from "../../util/util";
import { ButtonConfirm } from "../ui/ButtonConfirm";
import { SyntaxHighlighterCustom } from "../ui/SyntaxHighlighterCustom";
import { createQuestion } from "./QuestionFactory";

interface DeskCheckQuestionProps extends BaseQuestionProps {
  data: QuestionDeskCheck;
}

export const DeskCheckingQuestion = createQuestion<
  DeskCheckQuestionProps,
  QuestionDeskCheck
>({
  validateAnswer: ({ resposta, data }) => {
    return compareArrays(
      stringToArrayNumber(resposta),
      stringToArrayNumber(data.correctAnswer),
    );
  },

  Component: ({ data, onAnswer, isAbleToAnswer, validateAnswer }) => {
    const [answers, setAnswers] = useState<string[]>(
      Array.from({
        length: Array.isArray(data.correctAnswer)
          ? data.correctAnswer.length
          : 1,
      }).map(() => ""),
    );

    const activeCheckpoint = data.checkpoints[0];

    const answersToString = () => {
      return `[${answers.join(",")}]`;
    };

    const handleConfirmar = () => {
      if (!isAbleToAnswer) {
        toast.error("Você não pode responder ainda!");
        return;
      }

      const acertou = validateAnswer({
        resposta: answersToString(),
        data,
      });

      onAnswer(acertou, data.id);
    };

    // Gerencia as mudanças nos inputs de forma genérica
    const handleInputChange = (slotIndex: number, value: string) => {
      // 1. Atualiza o array de respostas baseado no índice
      setAnswers((prev) => {
        const newAnswers = [...prev]; // Cria uma cópia do array atual
        newAnswers[slotIndex] = value; // Atualiza apenas a posição específica
        return newAnswers;
      });
    };

    return (
      <div className="flex flex-col gap-4">
        <header className="flex justify-between items-center">
          <span className="text-xs font-bold px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500">
            Passo {1} de {data.checkpoints.length}
          </span>
        </header>
        <div className="flex flex-col gap-6 w-full mx-auto">
          {/* LADO ESQUERDO: CÓDIGO */}
          <div className="flex flex-col gap-4 ">
            <div className="rounded-2xl border border-slate-300 dark:border-slate-700 pb-2  ">
              <p className="text-sm text-blue-700 dark:text-blue-100 bg-blue-100 dark:bg-blue-700 flex gap-2 h-9 p-2 pb-0 rounded-t-2xl">
                <PlayCircle size={18} className="shrink-0" />
                <span>
                  Foque:{" "}
                  <strong>
                    Linha {activeCheckpoint.lineReference.length > 1 ? "s" : ""}{" "}
                    {activeCheckpoint.lineReference.join(" e ")}
                  </strong>
                </span>
              </p>
              <SyntaxHighlighterCustom
                highlightLines={[...activeCheckpoint.lineReference]}
              >
                {data.code}
              </SyntaxHighlighterCustom>
            </div>
          </div>

          {/* LADO DIREITO: RASTREIO (TIMELINE DE CARDS) */}
          <div className="flex flex-col gap-4">
            <div className="space-y-4">
              {data.checkpoints.map((cp, idx) => {
                return (
                  <div
                    key={idx}
                    className={`p-5 rounded-2xl border transition-all duration-300 ${"bg-white dark:bg-slate-900 border-blue-100 shadow-lg ring-1 ring-blue-500/50"}`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div>
                        <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                          {cp.description}
                        </h4>
                        {cp.iteration && (
                          <span className="text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-600 px-2 py-0.5 rounded uppercase font-black">
                            Volta {cp.iteration}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-4">
                      {cp.slots.map((slot, index) => (
                        <div key={slot.id} className="flex flex-col gap-1.5">
                          <label className="font-medium text-slate-500 tracking-tight">
                            {slot.label}
                          </label>

                          {slot.type === "BOOLEAN" ? (
                            <div className="flex gap-2">
                              {["True", "False"].map((val) => (
                                <button
                                  key={val}
                                  onClick={() =>
                                    handleInputChange(index, val.toLowerCase())
                                  }
                                  className={`flex-1 py-2 rounded-lg border font-bold text-sm transition-all ${
                                    answers[index] === val.toLowerCase()
                                      ? "bg-blue-600 border-blue-600 text-white"
                                      : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                                  } `}
                                >
                                  {val === "True" ? "V" : "F"}
                                </button>
                              ))}
                            </div>
                          ) : (
                            <div className="relative">
                              <input
                                type="text"
                                value={answers[index] || ""}
                                onChange={(e) =>
                                  handleInputChange(index, e.target.value)
                                }
                                placeholder={
                                  slot.type === "OUTPUT"
                                    ? "O que será impresso?"
                                    : "Valor..."
                                }
                                className={`w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border text-sm transition-all outline-none ${
                                  slot.type === "OUTPUT"
                                    ? "font-mono text-amber-500"
                                    : "text-slate-800 dark:text-slate-200"
                                } `}
                              />
                              {slot.type === "OUTPUT" && (
                                <Terminal
                                  size={14}
                                  className="absolute right-3 top-3 text-slate-500"
                                />
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <ButtonConfirm
          onClick={handleConfirmar}
          disabled={!isAbleToAnswer || answers.some((a) => a === "")}
          disabledText="Preencha todos os campos"
        />
      </div>
    );
  },
});
