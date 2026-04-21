import Quiz from "components/Quiz";
import { Navbar } from "components/ui/Navbar";
import { Sidebar } from "components/ui/Sidebar";
import { quizes } from "data/atividades";
import { useMemo, useState } from "react";
import { QuizData, Tema } from "types/quiz";
import "./App.css";

export default function App() {
  const [idQuestaoAtual, setIdQuestaoAtual] = useState<number | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [filtroConteudo, setFiltroConteudo] = useState("todos");
  const [filtroNivel, setFiltroNivel] = useState("todos");

  // 1. Calculamos a lista filtrada em tempo de execução
  // Usamos useMemo para performance
  const quizesFiltered = useMemo(() => {
    return Object.values(quizes)
      .map((quiz: QuizData) => {
        const questoesQuePassam = quiz.questoes.filter((q) => {
          const matchTipo = filtroTipo === "todos" || q.tipo === filtroTipo;
          const matchNivel = filtroNivel === "todos" || q.nivel === filtroNivel;
          return matchTipo && matchNivel;
        });
        return { ...quiz, questoes: questoesQuePassam };
      })
      .filter((quiz) => {
        const matchConteudo =
          filtroConteudo === "todos" ||
          quiz.tema.nome.toLocaleLowerCase().replaceAll(" ", "-") ===
            filtroConteudo;
        return quiz.questoes.length > 0 && matchConteudo;
      });
  }, [filtroTipo, filtroConteudo, filtroNivel]);

  // 2. Determinamos qual Quiz exibir com base na questão selecionada
  const quizAtual = useMemo(() => {
    if (idQuestaoAtual !== null) {
      return quizesFiltered.find((quiz) =>
        quiz.questoes.some((q) => q.id === idQuestaoAtual),
      );
    }
    return quizesFiltered[0]; // Padrão: primeiro quiz da lista filtrada
  }, [idQuestaoAtual, quizesFiltered]);

  // Funções de alteração
  const onChangeTema = (tema: Tema) => {
    // Ao trocar tema, selecionamos a primeira questão desse tema
    const quiz = quizesFiltered.find((q) => q.tema.id === tema.id);
    if (quiz && quiz.questoes.length > 0) {
      setIdQuestaoAtual(quiz.questoes[0].id);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 dark:bg-slate-950 transition-colors">
      <Navbar onOpenMenu={() => setIsSidebarOpen((prev) => !prev)} />
      <div className="flex">
        <Sidebar
          quizes={quizesFiltered} // Passa a lista já filtrada
          idTemaAtivo={quizAtual?.tema.id || 0}
          onSelecionarQuestao={setIdQuestaoAtual}
          onChangeTema={onChangeTema}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          filterTipo={filtroTipo}
          onFilterTipoChange={setFiltroTipo}
          filterConteudo={filtroConteudo}
          onFilterConteudoChange={setFiltroConteudo}
          filterNivel={filtroNivel}
          onFilterNivelChange={setFiltroNivel}
        />

        <main className="flex-1 flex justify-center py-4 px-4 md:py-6 md:px-6 min-h-[calc(100dvh-64px-8px)] max-h-[calc(100dvh-64px-8px)] overflow-y-auto bg-slate-50 dark:bg-slate-950">
          {quizAtual ? (
            <Quiz
              quizData={quizAtual}
              tipo="manual"
              idQuestaoAtual={idQuestaoAtual ?? quizAtual.questoes[0].id}
            />
          ) : (
            <div className="text-center mt-20">
              Nenhum resultado encontrado.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
