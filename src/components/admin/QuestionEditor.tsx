import {
  ArrowUpAZ,
  CheckCircle2,
  GitBranch,
  GitGraph,
  GripVertical,
  RectangleEllipsis,
  RedoDot,
  Search,
  Settings2,
  Share2,
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
  QUESTION_MULTIPLE_CHOICE_EMPTY,
  QUESTION_TRUE_FALSE_EMPTY,
} from "../../constants/questions";
import type {
  Level,
  Question,
  QuestionClickOnError,
  QuestionMultipleChoice,
  QuestionType,
} from "../../types/study";
import { getTipoQuestaoPorExtenso } from "../../util/Quiz";
import { QuestionSelector } from "../questions/QuestionSelector";
import { Feedback } from "../ui/Feedback";
import { Hint } from "../ui/Hint";
import { Input } from "../ui/Input";
import { Select, type SelectOption } from "../ui/Select";
import { TrashButton } from "../ui/TrashButton";
import { QuestionClickOnErrorEditor } from "./questions/QuestionClickOnErrorEditor";
import { QuestionMultipleChoiceEditor } from "./questions/QuestionMultipleChoiceEditor";
import { QuestionTrueFalseEditor } from "./questions/QuestionTrueFalse";

export const QuestionEditor = () => {
  const [view, setView] = useState<"form" | "preview">("form");
  const [type, setType] = useState<QuestionType>("multipla_escolha");

  const [question, setQuestion] = useState<Question>({
    id: 0,
    type: "multipla_escolha",
    level: "iniciante",
    code: "",
    options: [],
    rows: [],
    nodes: [],
    conections: [],
    root: "",
    questionText:
      "O enunciado da questão aparecerá aqui conforme você digita no editor...",
    explanation: "",
    correctAnswer: "",
    info: {
      status: "pendente",
      attemptCount: 0,
    },
    language: "pt-br",
  });

  const [questionMultipleChoice, setQuestionMultipleChoice] =
    useState<QuestionMultipleChoice>(QUESTION_MULTIPLE_CHOICE_EMPTY);

  const [questionClickOnError, setQuestionClickOnError] =
    useState<QuestionClickOnError>(QUESTION_CLICK_ON_ERROR_EMPTY);

  const [questionTrueFalse, setQuestionTrueFalse] =
    useState<QuestionMultipleChoice>(QUESTION_TRUE_FALSE_EMPTY);

  // Estados para os campos dinâmicos

  const [rows, setRows] = useState<{ text: string; identationLevel: number }[]>(
    [{ text: "", identationLevel: 0 }],
  );
  const [code, setCode] = useState("");

  const addRow = () => setRows([...rows, { text: "", identationLevel: 0 }]);

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

  const leveisOptions: SelectOption[] = [
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
      default:
        return question;
    }
  };

  const validateAnswer = (acertou: boolean) => {
    if (acertou) {
      setFeedback("correto");
      return;
    }
    setFeedback("errado");
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      {/* Coluna 1: Formulário */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[calc(100vh-150px)]">
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
                value={question.type}
                options={tiposQuestaoOrdenados}
                onChange={(value) => {
                  setType(value as QuestionType);
                  setQuestion({ ...question, type: value as QuestionType });
                }}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Nível de Dificuldade
              </label>
              <Select
                value={question.level}
                options={leveisOptions}
                onChange={(value) =>
                  setQuestion({ ...question, level: value as Level })
                }
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

          {/* Código / Lacuna / Predição */}
          {(type === "lacuna" ||
            type === "predicao" ||
            type === "teste_mesa") && (
            <div className="space-y-4 animate-in fade-in">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Bloco de Código / Texto Base
              </label>
              <div className="relative">
                <textarea
                  className="w-full p-4 font-mono text-xs bg-slate-950 text-emerald-400 rounded-2xl h-48 focus:ring-2 focus:ring-blue-500"
                  placeholder={
                    type === "lacuna"
                      ? "Use [[lacuna]] para marcar espaços"
                      : "Insira o código aqui..."
                  }
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
                <div className="absolute top-3 right-3 text-[10px] font-bold text-slate-600 bg-black/20 px-2 py-1 rounded">
                  Editor de Código
                </div>
              </div>
              {type === "teste_mesa" && (
                <button className="w-full py-3 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-400 hover:border-blue-500 hover:text-blue-500 transition-all">
                  + Configurar Checkpoints do Rastreio
                </button>
              )}
            </div>
          )}

          {/* Ordenação / Clique no Erro */}
          {type === "ordenacao" && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Linhas de Informação
                </label>
                <button
                  onClick={addRow}
                  className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded-lg font-bold hover:cursor-pointer"
                >
                  + Nova Linha
                </button>
              </div>
              <div className="space-y-2">
                {rows.map((row, i) => (
                  <div
                    key={i}
                    className="flex gap-2 items-center bg-slate-50 dark:bg-slate-800/40 p-2 rounded-xl border border-slate-100 dark:border-slate-800"
                  >
                    <GripVertical
                      size={16}
                      className="text-slate-300 cursor-grab"
                    />
                    <Input
                      type="number"
                      min={0}
                      fullWidth={false}
                      className="w-16 p-1.5 bg-white dark:bg-slate-900 rounded-lg text-xs text-center"
                      placeholder="Tab"
                      title="Nível de Indentação"
                    />
                    <Input
                      type="text"
                      className="flex-1 p-1.5 bg-white dark:bg-slate-900 rounded-lg text-sm "
                      placeholder="Código ou texto da linha..."
                    />

                    <TrashButton />
                  </div>
                ))}
              </div>
              <Hint>Use o checkbox para marcar a linha com erro.</Hint>
            </div>
          )}

          {/* Fluxograma */}
          {type === "fluxograma_novo" && (
            <div className="p-10 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-center space-y-4">
              <GitGraph className="mx-auto text-slate-300" size={48} />
              <p className="text-xs text-slate-500 font-medium">
                O editor de fluxograma utiliza interface visual externa.
              </p>
              <button className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl">
                Abrir Canvas de Desenho
              </button>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-end gap-3">
          <button className="px-6 py-2.5 text-slate-500 text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-all">
            Cancelar
          </button>
          <button className="px-8 py-2.5 bg-blue-600 text-white text-sm font-black rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center gap-2">
            Salvar Questão <Share2 size={16} />
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
            <div className="p-10 flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-[10px] font-black uppercase tracking-tighter">
                  {question.level}
                </span>
                <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-[10px] font-black uppercase tracking-tighter">
                  {getTipoQuestaoPorExtenso(question.type)}
                </span>
              </div>
              <QuestionSelector
                data={defineQuestion(type)}
                onAnswer={validateAnswer}
                isAbleToAnswer={true}
                disabled={feedback !== null}
                timerEnabled={false}
              />
              {feedback && (
                <Feedback
                  status={feedback}
                  respostaCorreta={defineQuestion(type).correctAnswer}
                  explanation={defineQuestion(type).explanation}
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
