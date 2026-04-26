import { useLessonMarkdown } from "hook/useDatabase";
import { ChevronRight } from "lucide-react";
import { useMemo } from "react";

import type { Lesson } from "types/lesson";
import type { Discipline } from "types/study";
import MarkdownRenderer from "./MarkdownRender";
import "./textBook.css";

interface TextbookProps {
  lesson: Lesson;
  discipline: Discipline;
  onLessonChange: (lessonId: string) => void;
}

export function Textbook({
  lesson,
  discipline,
  onLessonChange,
}: TextbookProps) {
  const { data: lessonMarkdown } = useLessonMarkdown(
    discipline.id,
    lesson.slug,
  );
  const markdown = useMemo(() => {
    return lessonMarkdown || "";
  }, [lessonMarkdown]);

  const handlePreviousLesson = () => {
    onLessonChange(String(parseInt(lesson.id) - 1));
  };

  const handleNextLesson = () => {
    onLessonChange(String(parseInt(lesson.id) + 1));
  };

  if (!lessonMarkdown) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="w-full flex bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
      {/* <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hidden md:flex flex-col">
        <SidebarSumario handleLessonChange={handleLessonChange} />
      </aside> */}

      {/* Área do Conteúdo */}
      <main className="flex-1 p-4 md:p-8 min-w-0">
        <section className="w-full prose prose-p:text-justify prose-pre:bg-transparent prose-pre:m-0 prose-slate prose-pre:p-2 prose-pre:pe-0 prose-pre:ps-0 dark:prose-invert prose-headings:font-bold prose-a:text-blue-500 prose-code:text-pink-500 prose-h1:prose-code:text-2xl prose-h1:mt-1 prose-h1:mb-2 prose-h2:mt-2 prose-h2:mb-2">
          {/* Cabeçalho da Aula */}
          <header className="mb-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="text-blue-500 font-bold text-xs uppercase tracking-widest">
              Aula {lesson.order}
            </div>
          </header>
          {/* Renderizador de Markdown */}
          {markdown && <MarkdownRenderer>{markdown}</MarkdownRenderer>}

          {/* Navegação entre aulas */}
          <footer className="mt-16 pt-8 border-t border-slate-100 dark:border-slate-800 flex justify-between">
            <button
              className="text-slate-400 hover:text-slate-900 font-medium flex items-center gap-2"
              onClick={handlePreviousLesson}
            >
              <ChevronRight size={20} className="rotate-180" /> Anterior
            </button>
            <button
              className="bg-slate-900 dark:bg-blue-600 text-white px-6 py-2 rounded-full font-bold"
              onClick={handleNextLesson}
            >
              Próxima Aula
            </button>
          </footer>
        </section>
      </main>
    </div>
  );
}
