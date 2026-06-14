import {
  ArrowUpAZ,
  CheckCircle2,
  GitBranch,
  RectangleEllipsis,
  RedoDot,
  Save,
  Search,
  Settings2,
  SignalHigh,
  SignalLow,
  SignalMedium,
  Split,
  Terminal,
} from "lucide-react";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import {
  QUESTION_CLICK_ON_ERROR_EMPTY,
  QUESTION_DESK_CHECKING_EMPTY,
  QUESTION_FILL_EMPTY,
  QUESTION_FLOWCHART_EMPTY,
  QUESTION_MULTIPLE_CHOICE_EMPTY,
  QUESTION_OUTPUT_EMPTY,
  QUESTION_REARRANGE_EMPTY,
  QUESTION_TRUE_FALSE_EMPTY,
} from "../../constants/questions";
import type {
  Level,
  QuestionClickOnError,
  QuestionDeskCheck,
  QuestionFill,
  QuestionFlowchartnNew,
  QuestionMultipleChoice,
  QuestionOutput,
  QuestionRearrange,
  QuestionType,
} from "../../types/study";
import { getTipoQuestaoPorExtenso } from "../../util/Quiz";
import { QuestionSelector } from "../questions/QuestionSelector";
import { Feedback } from "../ui/Feedback";
import { Select, type SelectOption } from "../ui/Select";
import { QuestionClickOnErrorEditor } from "./questions/QuestionClickOnErrorEditor";
import { QuestionDeskCheckingEditor } from "./questions/QuestionDeskCheckingEditor";
import { QuestionFillEditor } from "./questions/QuestionFillEditor";
import { QuestionFlowchartEditor } from "./questions/QuestionFlowchartEditor";
import { QuestionMultipleChoiceEditor } from "./questions/QuestionMultipleChoiceEditor";
import { QuestionOutputEditor } from "./questions/QuestionOutputEditor";
import { QuestionRearrangeEditor } from "./questions/QuestionRearrangeEditor";
import { QuestionTrueFalseEditor } from "./questions/QuestionTrueFalse";

export const QuestionEditor = () => {
  const [view, setView] = useState<"form" | "preview">("form");
  const [type, setType] = useState<QuestionType>("multipla_escolha");
  const [level, setLevel] = useState<Level>("iniciante");

  const [questionMultipleChoice, setQuestionMultipleChoice] =
    useState<QuestionMultipleChoice>(QUESTION_MULTIPLE_CHOICE_EMPTY);

  const [questionClickOnError, setQuestionClickOnError] =
    useState<QuestionClickOnError>(QUESTION_CLICK_ON_ERROR_EMPTY);

  const [questionTrueFalse, setQuestionTrueFalse] =
    useState<QuestionMultipleChoice>(QUESTION_TRUE_FALSE_EMPTY);

  const [questionRearrange, setQuestionRearrange] = useState<QuestionRearrange>(
    QUESTION_REARRANGE_EMPTY,
  );

  const [questionOutput, setQuestionOutput] = useState<QuestionOutput>(
    QUESTION_OUTPUT_EMPTY,
  );

  const [questionFill, setQuestionFill] =
    useState<QuestionFill>(QUESTION_FILL_EMPTY);

  const [questionFlowchart, setQuestionFlowchart] =
    useState<QuestionFlowchartnNew>(QUESTION_FLOWCHART_EMPTY);

  const [questionDeskChecking, setQuestionDeskChecking] =
    useState<QuestionDeskCheck>(QUESTION_DESK_CHECKING_EMPTY);

  const [feedback, setFeedback] = useState<"correto" | "errado" | null>(null);

  const selectIconSize = 16;
  const tiposQuestao: SelectOption[] = [
    {
      value: "multipla_escolha",
      label: "Múltipla Escolha",
      icon: <CheckCircle2 size={selectIconSize} />,
    },
    {
      value: "verdadeiro_falso",
      label: "Verdadeiro ou Falso",
      icon: <Split size={selectIconSize} />,
    },
    {
      value: "lacuna",
      label: "Preencher Lacuna",
      icon: <RectangleEllipsis size={selectIconSize} />,
    },
    {
      value: "predicao",
      label: "Predição de Saída",
      icon: <Terminal size={selectIconSize} />,
    },
    {
      value: "clique_erro",
      label: "Encontrar o Erro",
      icon: <Search size={selectIconSize} />,
    },
    {
      value: "ordenacao",
      label: "Ordenação",
      icon: <ArrowUpAZ size={selectIconSize} />,
    },
    {
      value: "fluxograma_novo",
      label: "Fluxograma (Novo)",
      icon: <GitBranch size={selectIconSize} />,
    },
    {
      value: "teste_mesa",
      label: "Teste de Mesa",
      icon: <RedoDot size={selectIconSize} />,
    },
  ];

  // Ordenar por nome (alfabeticamente)
  const tiposQuestaoOrdenados = [...tiposQuestao].sort((a, b) =>
    a.label.localeCompare(b.label),
  );

  const levelsOptions: SelectOption[] = [
    {
      value: "iniciante",
      label: "Iniciante",
      icon: <SignalLow size={selectIconSize} />,
    },
    {
      value: "intermediário",
      label: "Intermediário",
      icon: <SignalMedium size={selectIconSize} />,
    },
    {
      value: "avançado",
      label: "Avançado",
      icon: <SignalHigh size={selectIconSize} />,
    },
  ];

  const defineQuestion = (type: QuestionType) => {
    switch (type) {
      case "multipla_escolha":
        return questionMultipleChoice;
      case "clique_erro":
        return questionClickOnError;
      case "verdadeiro_falso":
        return questionTrueFalse;
      case "ordenacao":
        return questionRearrange;
      case "predicao":
        return questionOutput;
      case "lacuna":
        return questionFill;
      case "fluxograma_novo":
        return questionFlowchart;
      case "teste_mesa":
        return questionDeskChecking;
      default:
        return null;
    }
  };

  const validateAnswer = (acertou: boolean) => {
    if (acertou) {
      setFeedback("correto");
      return;
    }
    setFeedback("errado");
  };

  const question = defineQuestion(type);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      {/* Coluna 1: Formulário */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[calc(100vh-150px)] min-h-160">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <Settings2 size={18} className="text-blue-600" />
            <span className="font-bold text-slate-700 dark:text-slate-200">
              Configuração da Questão
            </span>
          </div>
          <div className="flex bg-slate-200 dark:bg-slate-700 p-1 rounded-xl">
            <button
              onClick={() => setView("form")}
              className={`px-4 py-1.5 text-xs rounded-lg font-bold transition-all ${view === "form" ? "bg-white dark:bg-slate-600 shadow-sm" : "text-slate-500"}`}
            >
              Editor
            </button>
            <button
              onClick={() => setView("preview")}
              className={`px-4 py-1.5 text-xs rounded-lg font-bold transition-all ${view === "preview" ? "bg-white dark:bg-slate-600 shadow-sm" : "text-slate-500"}`}
            >
              Preview
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-y-auto p-6 gap-2">
          {/* Cabeçalho Comum */}
          <div className="grid grid-cols-2 gap-4">
            <div className="">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Tipo de Questão
              </label>
              <Select
                value={type}
                options={tiposQuestaoOrdenados}
                onChange={(value) => {
                  setType(value as QuestionType);
                  setFeedback(null);
                }}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Nível de Dificuldade
              </label>
              <Select
                value={level}
                options={levelsOptions}
                onChange={(value) => setLevel(value as Level)}
              />
            </div>
          </div>

          {/* EDITOR DINÂMICO POR TIPO */}

          {/* Múltipla Escolha */}
          {type === "multipla_escolha" && (
            <QuestionMultipleChoiceEditor
              questionMultipleChoice={questionMultipleChoice}
              setQuestionMultipleChoice={setQuestionMultipleChoice}
            />
          )}

          {type === "clique_erro" && (
            <QuestionClickOnErrorEditor
              questionClickOnError={questionClickOnError}
              setQuestionClickOnError={setQuestionClickOnError}
            />
          )}

          {type === "verdadeiro_falso" && (
            <QuestionTrueFalseEditor
              questionTrueFalse={questionTrueFalse}
              setQuestionTrueFalse={setQuestionTrueFalse}
            />
          )}

          {type === "ordenacao" && (
            <QuestionRearrangeEditor
              questionRearrange={questionRearrange}
              setQuestionRearrange={setQuestionRearrange}
            />
          )}

          {type === "predicao" && (
            <QuestionOutputEditor
              questionOutput={questionOutput}
              setQuestionOutput={setQuestionOutput}
            />
          )}

          {type === "lacuna" && (
            <QuestionFillEditor
              questionFill={questionFill}
              setQuestionFill={setQuestionFill}
            />
          )}

          {type === "fluxograma_novo" && (
            <QuestionFlowchartEditor
              questionFlowchart={questionFlowchart}
              setQuestionFlowchart={setQuestionFlowchart}
            />
          )}

          {type === "teste_mesa" && (
            <QuestionDeskCheckingEditor
              questionDeskChecking={questionDeskChecking}
              setQuestionDeskChecking={setQuestionDeskChecking}
            />
          )}
        </div>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-end gap-3">
          <button className="px-6 py-2.5 text-slate-500 text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-all hover:cursor-pointer">
            Cancelar
          </button>
          <button className="px-8 py-2.5 bg-blue-600 text-white text-sm font-black rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 hover:cursor-pointer">
            <Save size={16} /> <span>Salvar Questão</span>
          </button>
        </div>
      </div>

      {/* Coluna 2: Preview em Tempo Real */}
      <div className="hidden xl:block bg-slate-100 dark:bg-slate-950/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 overflow-hidden relative">
        <div className="absolute top-6 left-6 flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          Preview em tempo real
        </div>

        <div className="h-full flex flex-col items-center justify-center p-12">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
            {question && (
              <div className="p-10 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-[10px] font-black uppercase tracking-tighter">
                    {level}
                  </span>
                  <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-[10px] font-black uppercase tracking-tighter">
                    {getTipoQuestaoPorExtenso(type)}
                  </span>
                </div>

                <QuestionSelector
                  data={question}
                  onAnswer={validateAnswer}
                  isAbleToAnswer={true}
                  disabled={feedback !== null}
                  timerEnabled={false}
                />
                {feedback && (
                  <Feedback
                    status={feedback}
                    respostaCorreta={question.correctAnswer}
                    explanation={question.explanation}
                  />
                )}
                <button
                  className="px-3 py-3 bg-blue-500 text-white font-bold rounded-lg hover:cursor-pointer hover:bg-blue-700 transition-all disabled:bg-slate-300 disabled:cursor-not-allowed"
                  disabled={feedback === null}
                  onClick={() => setFeedback(null)}
                >
                  Resetar preview
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          success: {
            style: {
              background: "#80EF80",
            },
          },
          error: {
            style: {
              background: "#ff746c",
              color: "#fff",
            },
          },
        }}
      />
    </div>
  );
};
