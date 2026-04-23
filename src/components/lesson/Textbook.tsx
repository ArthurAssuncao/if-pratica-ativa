import { BookOpen, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // Suporte a tabelas e listas de tarefas
import { LessonContent } from "types/lesson";
import { Discipline } from "types/study";

interface TextbookProps {
  lesson: LessonContent;
  discipline: Discipline;
  onLessonChange: (lessonId: string) => void;
}

export function Textbook({
  lesson,
  discipline,
  onLessonChange,
}: TextbookProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [markdown, setMarkdown] = useState("");

  useEffect(() => {
    // Busca o arquivo .md baseado no que está selecionado
    if (discipline.name && lesson) {
      const url = `/data/lessons/${discipline.id.toLocaleLowerCase()}/${lesson.slug}.md`;
      console.log("URL:", url);
      fetch(url)
        .then((res) => res.text())
        .then((text) => {
          lesson.markdown = text;
          setMarkdown(text);
          setIsLoading(false);
          console.log("Texto:", text);
        })
        .catch((err) => {
          console.error("Erro:", err);
        });
    }
  }, [lesson, discipline]);

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="flex h-[calc(100vh-120px)] bg-white dark:bg-slate-950 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800">
      {/* Sidebar - Índice */}
      <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
          <BookOpen size={20} className="text-blue-500" />
          <span>Sumário</span>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          <button
            key={lesson.id}
            onClick={() => onLessonChange(lesson.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all  "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
              }`}
          >
            <span className="opacity-50">{lesson.order}.</span>
            <span className="truncate">{lesson.title}</span>
          </button>
        </nav>
      </aside>

      {/* Área do Conteúdo */}
      <main className="flex-1 overflow-y-auto p-8 md:p-12 scroll-smooth">
        <article className="max-w-3xl mx-auto prose prose-slate dark:prose-invert prose-headings:font-bold prose-a:text-blue-500 prose-code:text-pink-500">
          {/* Cabeçalho da Aula */}
          <header className="mb-10 border-b border-slate-100 dark:border-slate-800 pb-8">
            <div className="text-blue-500 font-bold text-xs uppercase tracking-widest mb-2">
              Aula {lesson.order}
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">
              {lesson.title}
            </h1>
          </header>

          {/* Renderizador de Markdown */}
          {lesson.markdown && markdown && (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {markdown}
            </ReactMarkdown>
          )}

          {/* Navegação entre aulas */}
          <footer className="mt-16 pt-8 border-t border-slate-100 dark:border-slate-800 flex justify-between">
            <button className="text-slate-400 hover:text-slate-900 font-medium flex items-center gap-2">
              <ChevronRight size={20} className="rotate-180" /> Anterior
            </button>
            <button className="bg-slate-900 dark:bg-blue-600 text-white px-6 py-2 rounded-full font-bold">
              Próxima Aula
            </button>
          </footer>
        </article>
      </main>
    </div>
  );
}
