// src/pages/NotFound.tsx
import {
  ArrowLeft,
  BookOpen,
  FileQuestion,
  Home,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom"; // Se estiver usando React Router

export default function NotFound() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-100 flex flex-col items-center justify-center px-4 py-12">
      {/* Ícone decorativo flutuante - Livro Aberto */}
      <div className="absolute top-10 left-10 opacity-10 animate-pulse hidden lg:block">
        <BookOpen size={180} className="text-blue-600" strokeWidth={1} />
      </div>

      <div className="absolute bottom-10 right-10 opacity-10 animate-bounce hidden lg:block">
        <FileQuestion size={160} className="text-blue-500" strokeWidth={1} />
      </div>

      {/* Container principal */}
      <div className="relative z-10 max-w-2xl w-full text-center">
        {/* Número 404 com fundo azul elegante */}
        <div className="relative mb-8">
          <h1 className="text-9xl md:text-[180px] font-extrabold text-transparent bg-clip-text bg-linear-to-r from-blue-600 via-blue-500 to-indigo-600">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <Sparkles size={200} className="text-blue-600" />
          </div>
        </div>

        {/* Subtítulo e descrição */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <FileQuestion size={16} />
            <span>Página não encontrada</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
            Ops! Conteúdo não localizado
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">
            O material ou questão que você está procurando pode ter sido movido,
            removido ou ainda não foi adicionado à nossa biblioteca de
            conteúdos.
          </p>
        </div>

        {/* Botões de ação */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <Home size={18} />
            Voltar ao Início
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-sm hover:cursor-pointer"
          >
            <ArrowLeft size={18} />
            Voltar à página anterior
          </button>
        </div>
      </div>

      {/* Rodapé sutil */}
      <footer className="absolute bottom-6 left-0 right-0 text-center text-xs text-gray-400">
        <p>IF Aprenda - IF Sudeste MG</p>
      </footer>
    </div>
  );
}
