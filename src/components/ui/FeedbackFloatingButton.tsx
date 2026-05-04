import {
  AlertCircle,
  Bug,
  Lightbulb,
  MessageSquarePlus,
  Send,
  X,
} from "lucide-react";
import React, { useState } from "react";

type FeedbackType = "bug" | "sugestao" | "erro";

export const FeedbackFloatingButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<FeedbackType>("bug");
  const [description, setDescription] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    // Preparamos os dados para o serviço
    const formData = {
      access_key: import.meta.env.WEB3FORMS,
      subject: `Novo Feedback IF Pratica Ativa: ${type.toUpperCase()}`,
      from_name: "IF Pratica Ativa",
      type: type,
      message: description,
      page_url: window.location.href, // Útil para saber onde o bug ocorreu
    };

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setSent(true);
        setDescription("");
        setTimeout(() => {
          setIsOpen(false);
          setSent(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Erro ao enviar:", error);
      alert("Ocorreu um erro ao enviar seu feedback. Tente novamente.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-2 z-999">
      {/* Formulário Expandido */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-[90vw] sm:w-100 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in duration-200 origin-bottom-right">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
            <h3 className="font-bold text-slate-700 dark:text-white flex items-center gap-2">
              <MessageSquarePlus size={18} className="text-blue-500" />
              Enviar Feedback
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 hover:cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-5">
            {sent ? (
              <div className="py-10 text-center animate-in fade-in slide-in-from-bottom-2">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send size={24} />
                </div>
                <h4 className="font-bold text-slate-800 dark:text-white">
                  Obrigado!
                </h4>
                <p className="text-sm text-slate-500">
                  Sua mensagem foi enviada com sucesso.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Seleção de Tipo */}
                <div className="grid grid-cols-3 gap-2">
                  {(["bug", "sugestao", "erro"] as FeedbackType[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setType(t)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all hover:cursor-pointer ${
                        type === t
                          ? "border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-500/10"
                          : "border-transparent bg-slate-100 dark:bg-slate-800 text-slate-500 hover:border-blue-500"
                      }`}
                    >
                      {t === "bug" && <Bug size={18} />}
                      {t === "sugestao" && <Lightbulb size={18} />}
                      {t === "erro" && <AlertCircle size={18} />}
                      <span className="text-[10px] uppercase font-bold">
                        {t}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Descrição */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">
                    O que aconteceu?
                  </label>
                  <textarea
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descreva detalhadamente..."
                    className="w-full h-32 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none resize-none text-sm dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSending || !description}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:cursor-pointer"
                >
                  {isSending ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Enviar Relatório <Send size={16} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Botão Principal (Gatilho) */}
      <div className="flex flex-col items-center justify-center gap-1">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 hover:cursor-pointer ${
            isOpen
              ? "bg-slate-800 dark:bg-white text-white dark:text-slate-900 rotate-90"
              : "bg-blue-600 text-white"
          }`}
        >
          {isOpen ? <X size={28} /> : <MessageSquarePlus size={28} />}
        </button>
        {!isOpen && (
          <span className="text-sm text-slate-300 dark:text-slate-400">
            Enviar Feedback
          </span>
        )}
      </div>
    </div>
  );
};
