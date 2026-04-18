import {
  BookOpen,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Circle,
  Filter,
  XCircle,
} from "lucide-react";
import React, { useState } from "react";
import { QuizData, Quizes, StatusQuestao, Tema } from "types/quiz"; // Ajuste o path se necessário
import { LISTA_NIVEIS_QUESTAO, LISTA_TIPOS_QUESTAO } from "util/Quiz";
import { Select } from "./Select";

interface SidebarProps {
  quizes: Quizes;
  idTemaAtivo: number;
  onSelecionarQuestao: (id: number) => void;
  onChangeTema: (tema: Tema) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  quizes,
  idTemaAtivo,
  onSelecionarQuestao,
  onChangeTema, // Adicionado às props desestruturadas
}) => {
  const [expandidos, setExpandidos] = useState<number[]>([idTemaAtivo]);
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [filtroConteudo, setFiltroConteudo] = useState("todos");
  const [filtroNivel, setFiltroNivel] = useState("todos");

  const opcoesTipos = [
    { label: "Todos os tipos", value: "todos" },
    ...LISTA_TIPOS_QUESTAO,
  ];

  // Transformamos o objeto Quizes em uma array para renderizar a lista
  const listaQuizes: QuizData[] = Object.values(quizes);

  const opcoesConteudos = [
    { label: "Todos os Conteúdos", value: "todos" },
    ...listaQuizes.map((quiz) => ({
      label: quiz.tema.nome,
      value: quiz.tema.nome.toLocaleLowerCase().replaceAll(" ", "-"),
    })),
  ];

  const opcoesNiveis = [
    { label: "Todos os Níveis", value: "todos" },
    ...LISTA_NIVEIS_QUESTAO,
  ];

  const toggleTema = (id: number, tema: Tema) => {
    // Se clicar em um tema, avisamos o componente pai para trocar o Quiz ativo
    onChangeTema(tema);

    // Lógica de expandir/recolher
    setExpandidos((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );
  };

  const getIconStatus = (status: StatusQuestao) => {
    switch (status) {
      case "correta":
        return <CheckCircle size={14} className="text-green-500" />;
      case "errada":
        return <XCircle size={14} className="text-red-500" />;
      default:
        return (
          <Circle size={14} className="text-slate-400 dark:text-slate-600" />
        );
    }
  };

  return (
    <aside
      className="w-72 h-[calc(100vh-64px)] overflow-y-auto border-r transition-colors
      bg-slate-50 border-slate-200 text-slate-900 
      dark:bg-slate-950 dark:border-slate-800 dark:text-slate-200 p-4 sticky top-16"
    >
      {/* Filtros */}
      <div className="mb-8">
        <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">
          <Filter size={14} /> Filtros
        </h3>
        <Select
          options={opcoesTipos}
          value={filtroTipo}
          onChange={setFiltroTipo}
          placeholder="Selecione o tipo"
          label="Tipo"
        />

        <Select
          options={opcoesConteudos}
          value={filtroConteudo}
          onChange={setFiltroConteudo}
          placeholder="Selecione o conteúdo"
          label="Conteúdo"
        />

        <Select
          options={opcoesNiveis}
          value={filtroNivel}
          onChange={setFiltroNivel}
          placeholder="Selecione o nível"
          label="Nível"
        />
      </div>

      {/* Lista de Temas extraída de 'quizes' */}
      <div>
        <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">
          <BookOpen size={14} /> Temas
        </h3>

        <div className="space-y-2">
          {listaQuizes.map((item) => (
            <div key={item.tema.id} className="rounded-lg overflow-hidden ">
              <button
                onClick={() => toggleTema(item.tema.id, item.tema)}
                className={`w-full flex items-center justify-between p-2 transition-colors text-sm font-medium rounded-md hover:cursor-pointer ${
                  idTemaAtivo === item.tema.id
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                    : "hover:bg-slate-200 dark:hover:bg-slate-900"
                }`}
              >
                <div className="flex items-center gap-2 ">
                  {expandidos.includes(item.tema.id) ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                  {item.tema.nome}
                </div>
                <span className="text-[10px] bg-slate-200 dark:bg-slate-800 px-1.5 rounded text-slate-500 ">
                  {item.questoes.length}
                </span>
              </button>

              {/* Lista de questões do tema */}
              {expandidos.includes(item.tema.id) && (
                <div className="ml-4 mt-1 space-y-1 border-l border-slate-200 dark:border-slate-800 pl-2 animate-in slide-in-from-top-2 ">
                  {item.questoes.map((q) => (
                    <button
                      key={q.id}
                      onClick={() => onSelecionarQuestao(q.id)}
                      className="w-full flex items-center gap-3 p-2 text-xs hover:bg-green-100 dark:hover:bg-green-900/30 rounded transition-colors text-left hover:cursor-pointer"
                    >
                      {getIconStatus(q.infoQuestao?.status || "pendente")}
                      <span className="truncate">{q.pergunta}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};
