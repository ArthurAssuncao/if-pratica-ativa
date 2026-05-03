import { X } from "lucide-react";
import React, { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  // Bloqueia o scroll do body quando o modal está aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop (Fundo escurecido) */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Container do Modal */}
      <div className="relative w-full max-w-4xl max-h-full bg-white dark:bg-slate-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800">
        {/* Botão de Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition-colors z-10 hover:cursor-pointer"
          aria-label="Fechar modal"
        >
          <X size={20} />
        </button>

        {/* Área do Conteúdo com Scroll */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};
