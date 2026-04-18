import {
  BookOpen,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Circle,
  Filter,
  X, // Adicionado para o botão de fechar no mobile
  XCircle,
} from "lucide-react";
import React, { useState } from "react";
import { QuizData, Quizes, StatusQuestao, Tema } from "types/quiz";
import { LISTA_NIVEIS_QUESTAO, LISTA_TIPOS_QUESTAO } from "util/Quiz";
import { Select } from "./Select";

interface SidebarProps {
  quizes: Quizes;
  idTemaAtivo: number;
  isOpen: boolean; // Controla se está aberto no mobile
  onClose: () => void; // Função para fechar
  onSelecionarQuestao: (id: number) => void;
  onChangeTema: (tema: Tema) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  quizes,
  idTemaAtivo,
  isOpen,
  onClose,
  onSelecionarQuestao,
  onChangeTema,
}) => {
  const [expandidos, setExpandidos] = useState<number[]>([idTemaAtivo]);
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [filtroConteudo, setFiltroConteudo] = useState("todos");
  const [filtroNivel, setFiltroNivel] = useState("todos");

  const listaQuizes: QuizData[] = Object.values(quizes);

  const opcoesTipos = [
    { label: "Todos os tipos", value: "todos" },
    ...LISTA_TIPOS_QUESTAO,
  ];
  const opcoesNiveis = [
    { label: "Todos os Níveis", value: "todos" },
    ...LISTA_NIVEIS_QUESTAO,
  ];
  const opcoesConteudos = [
    { label: "Todos os Conteúdos", value: "todos" },
    ...listaQuizes.map((quiz) => ({
      label: quiz.tema.nome,
      value: quiz.tema.nome.toLocaleLowerCase().replaceAll(" ", "-"),
    })),
  ];

  const toggleTema = (id: number, tema: Tema) => {
    onChangeTema(tema);
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
    <>
      {/* Overlay para Mobile: Só aparece quando isOpen é true e em telas menores que LG */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-72 transition-transform duration-300 ease-in-out transform
          bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800
          lg:translate-x-0 lg:static lg:h-[calc(100vh-64px)] overflow-y-auto
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Header da Sidebar (Visível apenas no Mobile) */}
        <div className="flex items-center justify-between p-4 lg:hidden border-b dark:border-slate-800 mb-4">
          <span className="font-bold text-slate-700 dark:text-slate-200">
            Filtros e Temas
          </span>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          {/* Filtros */}
          <div className="mb-8">
            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">
              <Filter size={14} /> Filtros
            </h3>
            <div className="space-y-4">
              {" "}
              {/* Espaçamento entre os selects */}
              <Select
                options={opcoesTipos}
                value={filtroTipo}
                onChange={setFiltroTipo}
                label="Tipo"
              />
              <Select
                options={opcoesConteudos}
                value={filtroConteudo}
                onChange={setFiltroConteudo}
                label="Conteúdo"
              />
              <Select
                options={opcoesNiveis}
                value={filtroNivel}
                onChange={setFiltroNivel}
                label="Nível"
              />
            </div>
          </div>

          {/* Lista de Temas */}
          <div>
            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">
              <BookOpen size={14} /> Temas
            </h3>

            <div className="space-y-2">
              {listaQuizes.map((item) => (
                <div key={item.tema.id} className="rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleTema(item.tema.id, item.tema)}
                    className={`w-full flex items-center justify-between p-2 transition-colors text-sm font-medium rounded-md hover:cursor-pointer ${
                      idTemaAtivo === item.tema.id
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                        : "hover:bg-slate-200 dark:hover:bg-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {expandidos.includes(item.tema.id) ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                      {item.tema.nome}
                    </div>
                    <span className="text-[10px] bg-slate-200 dark:bg-slate-800 px-1.5 rounded text-slate-500">
                      {item.questoes.length}
                    </span>
                  </button>

                  {expandidos.includes(item.tema.id) && (
                    <div className="ml-4 mt-1 space-y-1 border-l border-slate-200 dark:border-slate-800 pl-2 animate-in slide-in-from-top-2">
                      {item.questoes.map((q) => (
                        <button
                          key={q.id}
                          onClick={() => {
                            onSelecionarQuestao(q.id);
                            // Opcional: fechar ao selecionar no mobile
                            if (window.innerWidth < 1024) onClose();
                          }}
                          className="w-full flex items-center gap-3 p-2 text-xs hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors text-left hover:cursor-pointer"
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
        </div>
      </aside>
    </>
  );
};
