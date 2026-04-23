import StudySelectionPage from "components/StudySelectionPage";
import { Footer } from "components/ui/Footer";
import { Navbar } from "components/ui/Navbar";
import { useState } from "react";
import "./App.css";

export default function App() {
  const [, setIsSidebarOpen] = useState(false);

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
