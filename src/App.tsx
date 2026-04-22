import StudySelectionPage from "components/StudySelectionPage";
import { Footer } from "components/ui/Footer";
import { Navbar } from "components/ui/Navbar";
import { useState } from "react";
import "./App.css";

export default function App() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Funções de alteração
  // const onChangeTema = (tema: Tema) => {
  //   // Ao trocar tema, selecionamos a primeira questão desse tema
  //   const quiz = quizesFiltered.find((q) => q.tema.id === tema.id);
  //   if (quiz && quiz.questoes.length > 0) {
  //     setIdQuestaoAtual(quiz.questoes[0].id);
  //   }
  // };

  return (
    <div className="min-h-screen bg-blue-50 dark:bg-slate-950 transition-colors">
      <header>
        <Navbar onOpenMenu={() => setIsSidebarOpen((prev) => !prev)} />
      </header>
      <div className="flex">
        {/* <Sidebar
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
        /> */}

        <StudySelectionPage />
      </div>
      <Footer />
    </div>
  );
}
