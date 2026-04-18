import { SyntaxHighlighterCustom } from "components/ui/SyntaxHighlighterCustom";
import { RotateCcw, Trash2 } from "lucide-react";
import React, { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { BaseQuestionProps } from "types/question";
import { OrdenacaoLinha } from "types/quiz";
import { TimeToResponse } from "./util/TimeToResponse";

export const RearrangeQuestion: React.FC<BaseQuestionProps> = ({
  data,
  aoResponder,
}) => {
  // Guardamos o objeto completo para ter acesso à indentação na renderização
  const [selecionadas, setSelecionadas] = useState<OrdenacaoLinha[]>([]);
  const [isAbleToRespond, setIsAbleToRespond] = useState(false);

  // Filtramos as opções comparando o texto ou ID para saber o que sobra
  const opcoesDisponiveis = useMemo(() => {
    return (
      data.linhas?.filter(
        (linhaOriginal) =>
          !selecionadas.some((s) => s.texto === linhaOriginal.texto),
      ) || []
    );
  }, [data.linhas, selecionadas]);

  const adicionarLinha = (linha: OrdenacaoLinha) => {
    setSelecionadas((prev) => [...prev, linha]);
  };

  const removerUltima = () => {
    setSelecionadas((prev) => prev.slice(0, -1));
  };

  const removerLinha = (index: number) => {
    setSelecionadas((prev) => prev.filter((_, i) => i !== index));
  };

  const resetar = () => setSelecionadas([]);

  const handleConfirmar = () => {
    if (!isAbleToRespond) {
      toast.error("Aguarde o tempo mínimo para analisar o código!");
      return;
    }

    // Enviamos apenas o texto unido por quebra de linha para a validação
    const respostaFinal = selecionadas.map((s) => s.texto).join("\n");
    aoResponder(respostaFinal);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Timer de segurança */}
      <TimeToResponse onTimerEnd={() => setIsAbleToRespond(true)} />

      {/* Área de Construção do Código */}
      <div
        className="flex flex-col gap-2 min-h-37.5 p-4 rounded-xl border-2 border-dashed 
        bg-olive-50 dark:bg-slate-900 border-slate-300  dark:border-slate-700"
      >
        {selecionadas.length === 0 && (
          <p className="text-slate-400 lg:text-sm italic m-auto">
            Clique nas linhas abaixo para construir o código...
          </p>
        )}
        {selecionadas.map((linha, index) => {
          // 1. Definição da lógica (precisa estar dentro das chaves)
          const linhaIdentada =
            " ".repeat((linha.identationLevel || 0) * 4) + linha.texto;

          // 2. OBRIGATÓRIO: usar o return para renderizar o componente
          return (
            <div
              key={`sel-${index}`}
              className="p-2 rounded border font-mono shadow-sm animate-in slide-in-from-left-2 flex items-center
        text-slate-700 dark:text-blue-300 border-olive-400 dark:border-slate-700 bg-yellow-50 dark:bg-blue-500/10 justify-between"
            >
              <div className="flex items-center">
                {" "}
                {/* Adicionado flex para alinhar o index com o código */}
                <span className="text-[12px] opacity-50 w-4 mr-2 font-mono">
                  {index + 1}
                </span>
                {/* Indentação Dinâmica */}
                <SyntaxHighlighterCustom showLineNumbers={false}>
                  {linhaIdentada}
                </SyntaxHighlighterCustom>
              </div>

              <button
                className="mr-1 text-xs text-slate-500 hover:text-red-500 hover:cursor-pointer"
                onClick={() => removerLinha(index)}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ); // Fechamento do return
        })}
      </div>

      {/* Controles de Edição */}
      <div className="flex gap-4 justify-end">
        <button
          onClick={removerUltima}
          disabled={selecionadas.length === 0}
          className="lg:text-sm flex items-center gap-1 text-slate-500 hover:text-red-500 cursor-pointer disabled:opacity-30"
        >
          <Trash2 size={14} /> Apagar última
        </button>
        <button
          onClick={resetar}
          disabled={selecionadas.length === 0}
          className="lg:text-sm flex items-center gap-1 text-slate-500 hover:text-orange-500 cursor-pointer disabled:opacity-30"
        >
          <RotateCcw size={14} /> Limpar tudo
        </button>
      </div>

      {/* Opções Disponíveis */}
      <div className="grid gap-2">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Linhas disponíveis:
        </p>

        <div className="flex flex-wrap gap-2 min-h-8">
          {opcoesDisponiveis.length > 0 &&
            opcoesDisponiveis.map((linha, index) => (
              <button
                key={`opt-${index}`}
                onClick={() => adicionarLinha(linha)}
                className="p-2 rounded-lg border font-mono transition-all cursor-pointer
                bg-white border-slate-200 hover:border-blue-500 text-slate-700 dark:text-blue-300
                dark:bg-slate-800 dark:border-slate-700 dark:hover:border-blue-400 "
              >
                <SyntaxHighlighterCustom showLineNumbers={false}>
                  {linha.texto}
                </SyntaxHighlighterCustom>
              </button>
            ))}
          {opcoesDisponiveis.length === 0 && (
            <p className="text-xs italic text-slate-700 dark:text-blue-300">
              Nenhuma linha disponível
            </p>
          )}
        </div>
      </div>
      {/* Botão de Validação Final */}
      <button
        disabled={opcoesDisponiveis.length > 0}
        onClick={handleConfirmar}
        className={`w-full p-3 rounded-lg font-bold transition-all cursor-pointer ${
          opcoesDisponiveis.length === 0
            ? "bg-green-600 text-white hover:bg-green-500 shadow-lg"
            : "bg-slate-200 text-slate-400 dark:bg-slate-800 cursor-not-allowed"
        }`}
      >
        {opcoesDisponiveis.length === 0
          ? "Validar Algoritmo"
          : `Faltam ${opcoesDisponiveis.length} linhas`}
      </button>
    </div>
  );
};
