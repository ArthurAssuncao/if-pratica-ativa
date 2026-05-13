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
  Split,
  Terminal,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import type { Level, QuestionType } from "../../types/study";
import { Select, type SelectOption } from "../ui/Select";

export const QuestionEditor = () => {
  const [view, setView] = useState<"form" | "preview">("form");
  const [type, setType] = useState<QuestionType>("multipla_escolha");
  const [level, setLevel] = useState<Level>("iniciante");

  // Estados para os campos dinâmicos
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [rows, setRows] = useState<{ text: string; identationLevel: number }[]>(
    [],
  );
  const [code, setCode] = useState("");

  const addOption = () => setOptions([...options, ""]);
  const addRow = () => setRows([...rows, { text: "", identationLevel: 0 }]);

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
    { value: "iniciante", label: "Iniciante" },
    { value: "intermediário", label: "Intermediário" },
    { value: "avançado", label: "Avançado" },
  ];

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

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Cabeçalho Comum */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Tipo de Questão
              </label>
              <Select
                value={type}
                options={tiposQuestaoOrdenados}
                onChange={(value) => setType(value as QuestionType)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Nível de Dificuldade
              </label>
              <Select
                value={level}
                options={leveisOptions}
                onChange={(value) => setLevel(value as Level)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Enunciado / Pergunta
            </label>
            <textarea
              className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-none h-24 text-sm focus:ring-2 focus:ring-blue-500"
              placeholder="Descreva o que o aluno deve fazer..."
            />
          </div>

          {/* EDITOR DINÂMICO POR TIPO */}

          {/* Múltipla Escolha */}
          {type === "multipla_escolha" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Opções de Resposta
                </label>
                <button
                  onClick={addOption}
                  className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded-lg font-bold"
                >
                  + Adicionar
                </button>
              </div>
              <div className="space-y-2">
                {options.map((opt, i) => (
                  <div key={i} className="flex gap-2 group">
                    <div className="flex items-center px-2 bg-slate-100 dark:bg-slate-800 rounded-xl">
                      <input
                        type="radio"
                        name="correct"
                        className="w-4 h-4 text-blue-600"
                      />
                    </div>
                    <input
                      type="text"
                      className="flex-1 p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm border-none"
                      placeholder={`Alternativa ${i + 1}`}
                      value={opt}
                    />
                    <button className="opacity-0 group-hover:opacity-100 p-2 text-rose-500">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
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
          {(type === "ordenacao" || type === "clique_erro") && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Linhas de Informação
                </label>
                <button
                  onClick={addRow}
                  className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded-lg font-bold"
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
                    <input
                      type="number"
                      className="w-12 p-1.5 bg-white dark:bg-slate-900 rounded-lg text-xs text-center border-none"
                      placeholder="Tab"
                      title="Nível de Indentação"
                    />
                    <input
                      type="text"
                      className="flex-1 p-1.5 bg-white dark:bg-slate-900 rounded-lg text-sm border-none"
                      placeholder="Conteúdo da linha..."
                    />
                    {type === "clique_erro" && (
                      <input
                        type="checkbox"
                        title="É a linha com erro?"
                        className="accent-rose-500"
                      />
                    )}
                    <button className="p-1.5 text-slate-400 hover:text-rose-500">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
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

          <div className="space-y-1.5 pt-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Explicação (Feedback Positivo)
            </label>
            <textarea
              className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-none h-20 text-sm italic"
              placeholder="Por que esta resposta está correta?"
            />
          </div>
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
          {/* Card Mockup de como o Aluno verá */}
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
            <div className="h-2 bg-blue-600 w-1/3" />
            <div className="p-10">
              <div className="flex justify-between items-start mb-6">
                <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-[10px] font-black uppercase tracking-tighter">
                  {level}
                </span>
                <span className="text-[10px] font-bold text-slate-400">
                  Questão #01
                </span>
              </div>

              <h2 className="text-xl font-bold mb-8 text-slate-800 dark:text-white leading-snug">
                Título ou Enunciado da questão aparecerá aqui conforme você
                digita no editor...
              </h2>

              <div className="space-y-3">
                {/* Renderização simulada do componente baseado no 'type' */}
                {type === "multipla_escolha" && (
                  <>
                    <div className="p-4 border-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full border-2 border-blue-600 flex items-center justify-center">
                        <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />
                      </div>
                      <span className="text-sm font-bold text-blue-700 dark:text-blue-300">
                        Opção Selecionada
                      </span>
                    </div>
                    <div className="p-4 border-2 border-slate-100 dark:border-slate-800 rounded-2xl flex items-center gap-3 opacity-50">
                      <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
                      <span className="text-sm font-medium">
                        Outra Alternativa
                      </span>
                    </div>
                  </>
                )}

                {(type === "lacuna" || type === "predicao") && (
                  <div className="bg-slate-950 p-6 rounded-2xl font-mono text-xs text-emerald-400 leading-relaxed shadow-inner">
                    {code || "O código aparecerá aqui..."}
                  </div>
                )}

                {type === "ordenacao" && (
                  <div className="space-y-2">
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border-2 border-slate-200 dark:border-slate-700 border-b-4 flex items-center gap-3">
                      <GripVertical size={14} className="text-slate-400" />
                      <span className="text-xs font-bold italic">
                        Linha de informação 01
                      </span>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border-2 border-slate-200 dark:border-slate-700 border-b-4 flex items-center gap-3">
                      <GripVertical size={14} className="text-slate-400" />
                      <span className="text-xs font-bold italic">
                        Linha de informação 02
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <button className="w-full mt-10 py-4 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-2xl font-black uppercase text-xs tracking-widest cursor-not-allowed">
                Verificar Resposta
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
