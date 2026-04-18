import Quiz from "components/Quiz";
import { Navbar } from "components/ui/Navbar";
import { Sidebar } from "components/ui/Sidebar";
import { quizes } from "data/atividades";
import { useState } from "react";
import { Questao, QuizData, Tema } from "types/quiz";
import "./App.css";

export default function App() {
  const temasData: Tema[] = Object.values(quizes).map((quiz) => quiz.tema);
  // Exemplo de estado para gerenciar os temas (isso viria do seu JSON/API)
  const [temas] = useState<Tema[]>(temasData);
  const [quizAtual, setQuizAtual] = useState<QuizData>(quizes[temas[0].id]);
  const [idQuestaoAtual, setIdQuestaoAtual] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const onChangeTema = (tema: Tema) => {
    setQuizAtual(quizes[tema.id]);
  };

  const onChangeQuestao = (id: number) => {
    setIdQuestaoAtual(id);
    // encontra qual o Quiz/Tema atual com base no id da questão
    const quizEncontrado: QuizData = Object.values(quizes).find((quiz) =>
      quiz.questoes.some((q: Questao) => q.id === id),
    );

    setQuizAtual(quizEncontrado);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <Navbar onOpenMenu={() => setIsSidebarOpen((prev) => !prev)} />
      <div className="flex">
        {/* Sidebar fixa lateralmente */}
        <Sidebar
          quizes={quizes}
          idTemaAtivo={0}
          onSelecionarQuestao={onChangeQuestao}
          onChangeTema={onChangeTema}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Área do Conteúdo Principal */}
        <main className="flex-1 flex justify-center py-10 px-6">
          <Quiz
            quizData={quizAtual}
            tipo="manual"
            idQuestaoAtual={idQuestaoAtual}
          />
        </main>
      </div>
    </div>
  );
}
