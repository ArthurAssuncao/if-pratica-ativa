import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

import type { Nivel, TipoQuestao } from "types/quiz";

// Importando os componentes extraídos
import { QuestionSelector } from "components/questions/QuestionSelector";
import { Feedback } from "components/ui/Feedback";
import { ProgressBar } from "components/ui/ProgressBar";
import { ResultScreen } from "components/ui/ResultScreen";
import { Toaster } from "react-hot-toast";
import type { Quiz } from "types/study";
import { getTipoQuestaoPorExtenso } from "util/Quiz";

interface QuizProps {
  quiz: Quiz;
  level?: Nivel;
  questionType?: TipoQuestao;
}

export default function Quiz({ quiz }: QuizProps) {
  const [pontos, setPontos] = useState(0);
  const [feedback, setFeedback] = useState<"correto" | "errado" | null>(null);
  const [questoesRealizadas, setQuestoesRealizadas] = useState<Set<number>>(
    new Set(),
  );
  const [atual, setAtual] = useState(0);

  const fim = questoesRealizadas.size === quiz.questions.length;

  const questaoAnterior = () => {
    if (atual > 0) {
      setAtual(atual - 1);
      setFeedback(null);
      return;
    }
    setAtual(quiz.questions.length - 1);
    setFeedback(null);
  };

  const questaoProxima = () => {
    if (atual < quiz.questions.length - 1) {
      setAtual(atual + 1);
      setFeedback(null);
      return;
    }
    setAtual(0);
    setFeedback(null);
  };

  // const defineIconStatus = (status: StatusQuestao) => {
  //   switch (status) {
  //     case "correta":
  //       return <BadgeCheck size={24} className="text-green-500" />;
  //     case "errada":
  //       return <BadgeX size={24} className="text-red-500" />;
  //     default:
  //       return (
  //         <Badge size={24} className="text-slate-200 dark:text-slate-600" />
  //       );
  //   }
  // };

  const validateAnswer = (acertou: boolean, idQuestao: number) => {
    if (!quiz.questions) return;

    if (acertou) {
      setFeedback("correto");
      setPontos((p) => p + 1);
    } else {
      setFeedback("errado");
    }
    setQuestoesRealizadas((prev) => new Set([...prev, idQuestao]));
  };

  if (quiz.questions && fim)
    return <ResultScreen pontos={pontos} total={quiz.questions.length} />;

  if (!quiz.questions)
    return (
      <div className="min-h-screen p-6 flex flex-col items-center">
        <div
          className="w-full max-w-2xl p-8 rounded-2xl shadow-xl border transition-colors duration-300
    bg-white border-slate-200 text-slate-900 
    dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
        >
          Nenhuma questão disponível
        </div>
      </div>
    );

  return (
    <div className="w-full h-full p-0 lg:p-6 flex flex-col items-center">
      <ProgressBar
        atual={questoesRealizadas.size}
        total={quiz.questions.length}
      />

      <div
        className="flex-1 w-full max-w-2xl p-4 lg:p-8 rounded-2xl shadow-xl border transition-colors duration-300
      bg-white border-slate-200 text-slate-900 
      dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
      >
        <header className="flex justify-between items-center">
          <div className="flex gap-2">
            <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
              {quiz.contentName}
            </span>
            <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest hidden md:block">
              {getTipoQuestaoPorExtenso(quiz.questions[atual].type)}
            </span>
          </div>

          <span className="text-slate-400 dark:text-slate-500 font-mono"></span>
        </header>

        <div className="mb-4 flex flex-col gap-4 justify-between min-h-full">
          <div className="flex flex-col gap-4">
            <QuestionSelector
              data={quiz.questions[atual]}
              onAnswer={validateAnswer}
              isAbleToAnswer={false}
              disabled={feedback !== null}
            />
            {feedback && (
              <Feedback
                status={feedback}
                respostaCorreta={quiz.questions[atual].correctAnswer}
              />
            )}
            {feedback && (
              <button
                onClick={() => (setAtual(atual + 1), setFeedback(null))}
                className="bg-green-500 dark:bg-green-500 border-olive-300 dark:border-slate-600 text-slate-50 dark:text-slate-800 border w-full flex items-center justify-center gap-2  p-4 mb-2 rounded-lg font-bold hover:bg-green-600 dark:hover:bg-green-400 hover:text-slate-50 dark:hover:text-slate-900 transition-colors hover:cursor-pointer"
              >
                Continuar <ArrowRight size={20} />
              </button>
            )}
          </div>

          <div className="lg:text-xs text-slate-400 dark:text-slate-500 flex items-center justify-between mb-6">
            <span className="text-green-500 dark:text-green-400 hover:cursor-pointer hover:text-green-700 dark:hover:text-green-300 transition-all">
              <ChevronLeft size={32} onClick={() => questaoAnterior()} />
            </span>
            <div className="flex flex-col items-center gap-2">
              <span>
                Questão {atual + 1} de {quiz.questions.length}
              </span>
              <span>
                Foram realizadas {questoesRealizadas.size} de{" "}
                {quiz.questions.length}
              </span>
            </div>
            <span className="text-green-500 dark:text-green-400 hover:cursor-pointer hover:text-green-700 dark:hover:text-green-300 transition-all">
              <ChevronRight size={32} onClick={() => questaoProxima()} />
            </span>
          </div>
        </div>
      </div>
      <div>
        <Toaster position="bottom-right" />
      </div>
    </div>
  );
}
