import {
  BookOpen,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Circle,
  Filter,
  Gauge,
  Library,
  Shapes, // Adicionado para o botão de fechar no mobile
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
  filterTipo: string;
  filterConteudo: string;
  filterNivel: string;
  onClose: () => void; // Função para fechar
  onSelecionarQuestao: (id: number) => void;
  onChangeTema: (tema: Tema) => void;
  onFilterTipoChange: (tipo: string) => void;
  onFilterConteudoChange: (conteudo: string) => void;
  onFilterNivelChange: (nivel: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  quizes,
  idTemaAtivo,
  isOpen,
  filterTipo,
  filterConteudo,
  filterNivel,
  onClose,
  onSelecionarQuestao,
  onChangeTema,
  onFilterTipoChange,
  onFilterConteudoChange,
  onFilterNivelChange,
}) => {
  const [expandidos, setExpandidos] = useState<number[]>([idTemaAtivo]);

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
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed inset-y-16 left-0 z-49 w-80 max-w-full transition-transform duration-300 ease-in-out transform
          bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800
          lg:translate-x-0 lg:static  h-[calc(100vh-64px)] max-h-screen overflow-y-auto
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="p-4 max-h-screen overflow-y-auto">
          {/* Filtros */}
          <div className="mb-2">
            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">
              <Filter size={14} /> Filtros
            </h3>
            <div className="relative flex gap-4 flex-wrap">
              {" "}
              {/* Espaçamento entre os selects */}
              <Select
                options={opcoesTipos}
                value={filterTipo}
                onChange={onFilterTipoChange}
                label="Tipo"
                onlyTextIcon
                icon={Shapes}
              />
              <Select
                options={opcoesConteudos}
                value={filterConteudo}
                onChange={onFilterConteudoChange}
                label="Conteúdo"
                onlyTextIcon
                icon={Library}
              />
              <Select
                options={opcoesNiveis}
                value={filterNivel}
                onChange={onFilterNivelChange}
                label="Nível"
                onlyTextIcon
                icon={Gauge}
              />
            </div>
          </div>

          {/* Lista de Temas */}
          <div className="mt-4">
            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 ">
              <BookOpen size={14} /> Temas
            </h3>

            <div className="space-y-2">
              {listaQuizes.map((item) => (
                <div key={item.tema.id} className="rounded-lg overflow-y-auto">
                  <button
                    onClick={() => toggleTema(item.tema.id, item.tema)}
                    className={`text-slate-700 dark:text-blue-300 w-full flex items-center justify-between p-2 transition-colors lg:text-sm font-medium rounded-md hover:cursor-pointer ${
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
                    <span className="lg:text-sm bg-slate-200 dark:bg-slate-800 px-1.5 rounded text-slate-500">
                      {item.questoes.length}
                    </span>
                  </button>

                  {expandidos.includes(item.tema.id) && (
                    <div className="ml-4 mt-1 space-y-1 border-l border-slate-200 dark:border-slate-800 pl-2 animate-in slide-in-from-top-2 overflow-y-auto scroll-auto max-h-96">
                      {item.questoes.map((q) => (
                        <button
                          key={q.id}
                          onClick={() => {
                            onSelecionarQuestao(q.id);
                            // Opcional: fechar ao selecionar no mobile
                            if (window.innerWidth < 1024) onClose();
                          }}
                          className="text-slate-700 dark:text-blue-300 w-full flex items-center gap-3 p-2 lg:text-xs hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors text-left hover:cursor-pointer"
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
