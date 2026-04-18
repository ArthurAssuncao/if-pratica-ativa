import {
  ArrowRight,
  Badge,
  BadgeCheck,
  BadgeX,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useEffect, useState } from "react";

import {
  Nivel,
  Questao,
  QuizData,
  StatusQuestao,
  TipoQuestao,
  TipoQuiz,
} from "types/quiz";

// Importando os componentes extraídos
import { QuestionSelector } from "components/questions/QuestionSelector";
import { Feedback } from "components/ui/Feedback";
import { ProgressBar } from "components/ui/ProgressBar";
import { ResultScreen } from "components/ui/ResultScreen";
import { Toaster } from "react-hot-toast";
import { getTipoQuestaoPorExtenso } from "util/Quiz";
import { MarkdownSyntax } from "./ui/MarkdownSyntax";

interface QuizProps {
  quizData: QuizData;
  nivel?: Nivel;
  tipoQuestao?: TipoQuestao;
  tipo: TipoQuiz;
  idQuestaoAtual?: number;
}

export default function Quiz({ quizData, tipo, idQuestaoAtual }: QuizProps) {
  const [pontos, setPontos] = useState(0);
  const [feedback, setFeedback] = useState<"correto" | "errado" | null>(null);
  const [questoesRealizadas, setQuestoesRealizadas] = useState<number>(0);

  const fim = questoesRealizadas === quizData.questoes.length;

  const [questoes] = useState<Questao[]>(() => {
    if (tipo === "automatico") {
      return [...quizData.questoes].sort(() => 0.5 - Math.random()).slice(0, 5);
    }
    return quizData.questoes;
  });
  const indexQuestao = questoes.findIndex((q) => q.id === idQuestaoAtual);
  console.log(idQuestaoAtual, indexQuestao, questoes);
  const [atual, setAtual] = useState(indexQuestao > -1 ? indexQuestao : 0);

  useEffect(() => {
    const novoIndex = questoes.findIndex((q) => q.id === idQuestaoAtual);
    if (novoIndex > -1) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAtual(novoIndex);
      setFeedback(null);
    }
  }, [idQuestaoAtual, questoes]);

  const questaoAnterior = () => {
    if (atual > 0) {
      setAtual(atual - 1);
      setFeedback(null);
      return;
    }
    setAtual(quizData.questoes.length - 1);
    setFeedback(null);
  };

  const questaoProxima = () => {
    if (atual < quizData.questoes.length - 1) {
      setAtual(atual + 1);
      setFeedback(null);
      return;
    }
    setAtual(0);
    setFeedback(null);
  };

  const defineIconStatus = (status: StatusQuestao) => {
    switch (status) {
      case "correta":
        return <BadgeCheck size={24} className="text-green-500" />;
      case "errada":
        return <BadgeX size={24} className="text-red-500" />;
      default:
        return (
          <Badge size={24} className="text-slate-200 dark:text-slate-600" />
        );
    }
  };

  const validarResposta = (respostaUsuario: string) => {
    if (!questoes) return;
    const questaoAtual = questoes[atual];
    let acertou = false;

    const limpar = (str: string | number) =>
      str.toString().replace(/\s+/g, "").toLowerCase().trim();

    if (questaoAtual.tipo === "clique_erro") {
      acertou = respostaUsuario === questaoAtual.indexErro?.toString();
    } else {
      // A lógica de "limpar" funciona para ordenação, lacuna e múltipla escolha
      acertou =
        limpar(respostaUsuario) === limpar(questaoAtual.resposta_correta);
    }

    if (acertou) {
      setFeedback("correto");
      setPontos((p) => p + 1);
    } else {
      setFeedback("errado");
    }
    setQuestoesRealizadas((q) => q + 1);
  };

  if (questoes && fim)
    return <ResultScreen pontos={pontos} total={questoes.length} />;

  if (!questoes)
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
    <div className="min-h-screen p-6 flex flex-col items-center">
      <ProgressBar atual={questoesRealizadas} total={questoes.length} />
      <div
        className="w-full max-w-2xl p-8 rounded-2xl shadow-xl border transition-colors duration-300
    bg-white border-slate-200 text-slate-900 
    dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
      >
        <header className="flex justify-between items-center mb-8">
          <div className="flex gap-2">
            <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase">
              {quizData.tema.nome}
            </span>
            <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-bold tracking-widest">
              {getTipoQuestaoPorExtenso(questoes[atual].tipo)}
            </span>
          </div>

          <span className="text-slate-400 dark:text-slate-500 font-mono">
            {defineIconStatus(
              questoes[atual].infoQuestao?.status || "pendente",
            )}
          </span>
        </header>

        <h2 className="text-2xl font-bold mb-8 text-gray-700 dark:text-slate-200">
          <MarkdownSyntax>{questoes[atual].pergunta}</MarkdownSyntax>
        </h2>

        <div className="mb-8">
          {!feedback ? (
            <QuestionSelector
              data={questoes[atual]}
              aoResponder={validarResposta}
            />
          ) : (
            <Feedback
              status={feedback}
              respostaCorreta={questoes[atual].resposta_correta}
            />
          )}
        </div>

        {feedback && (
          <button
            onClick={() => (setAtual(atual + 1), setFeedback(null))}
            className="bg-green-500 dark:bg-green-500 border-olive-300 dark:border-slate-600 text-slate-200 dark:text-slate-800 border w-full flex items-center justify-center gap-2  p-4 mb-2 rounded-xl font-bold hover:bg-green-600 dark:hover:bg-green-400 hover:text-slate-50 dark:hover:text-slate-900 transition-colors hover:cursor-pointer"
          >
            Continuar <ArrowRight size={20} />
          </button>
        )}
        <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center justify-between">
          <span className="text-green-500 dark:text-green-400 hover:cursor-pointer hover:text-green-700 dark:hover:text-green-300 transition-all">
            <ChevronLeft size={32} onClick={() => questaoAnterior()} />
          </span>
          <div className="flex flex-col items-center gap-2">
            <span>
              Questão {atual + 1} de {quizData.questoes.length}
            </span>
            <span>
              Foram realizadas {questoesRealizadas} de{" "}
              {quizData.questoes.length}
            </span>
          </div>
          <span className="text-green-500 dark:text-green-400 hover:cursor-pointer hover:text-green-700 dark:hover:text-green-300 transition-all">
            <ChevronRight size={32} onClick={() => questaoProxima()} />
          </span>
        </span>
      </div>
      <div>
        <Toaster position="bottom-right" />
      </div>
    </div>
  );
}
