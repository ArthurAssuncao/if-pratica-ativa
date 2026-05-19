import { ButtonConfirm } from "components/ui/ButtonConfirm";
import { SyntaxHighlighterCustom } from "components/ui/SyntaxHighlighterCustom";
import { RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import type { BaseQuestionProps } from "types/question";
import type { QuestionRearrange, RearrangeRow } from "types/study";
import { rearrangeAnswer } from "../../util/answer";
import { shuffleArray } from "../../util/util";
import DragDropList from "../ui/DragDropList";
import { Hint } from "../ui/Hint";
import { NegativeActionButton } from "../ui/NegativeActionButton";
import { TrashButton } from "../ui/TrashButton";
import { createQuestion } from "./QuestionFactory";

interface RearrangeQuestionProps extends BaseQuestionProps {
  data: QuestionRearrange;
  randomOption?: boolean;
}

export const RearrangeQuestion = createQuestion<
  RearrangeQuestionProps,
  QuestionRearrange
>({
  validateAnswer: ({ resposta, data }) => {
    console.log("resposta", resposta);
    console.log("resposta-correta", data.correctAnswer.option.toString());
    return resposta === data.correctAnswer.option.toString();
  },

  Component: ({
    data,
    onAnswer,
    isAbleToAnswer,
    validateAnswer,
    randomOption,
  }) => {
    // Guardamos o objeto completo para ter acesso à indentação na renderização
    const [selecionadas, setSelecionadas] = useState<RearrangeRow[]>([]);

    const rowsRandom = useMemo(() => {
      if (!randomOption) {
        return data.rows;
      }
      return shuffleArray(data.rows);
    }, [data.rows, randomOption]);

    // Filtramos as opções comparando o texto ou ID para saber o que sobra
    const opcoesDisponiveis = useMemo(() => {
      return (
        rowsRandom.filter(
          (linhaOriginal) =>
            !selecionadas.some((s) => s.text === linhaOriginal.text),
        ) || []
      );
    }, [rowsRandom, selecionadas]);

    const adicionarLinha = (linha: RearrangeRow) => {
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
      if (!isAbleToAnswer) {
        toast.error("Você não pode responder ainda!");
        return;
      }

      const respostaFinal = rearrangeAnswer(selecionadas);

      const acertou = validateAnswer({
        resposta: respostaFinal,
        data,
      });

      onAnswer(acertou, data.id);
    };

    const getRowsPlusId = (rows: RearrangeRow[]) => {
      return rows.map((row, index) => ({ ...row, id: index }));
    };

    const handleReorder = (rows: RearrangeRow[]) => {
      setSelecionadas(rows);
    };

    const RenderRowItem = (row: RearrangeRow & { id: number }) => {
      const index = row.id;
      const linhaIdentada =
        " ".repeat((row.identationLevel || 0) * 4) + row.text;
      return (
        <div
          key={`RearrangeQuestion-Row-${index}`}
          className="px-2 rounded-lg border font-mono shadow-sm animate-in slide-in-from-left-2 flex items-center
        text-slate-700 dark:text-blue-300 border-olive-400 dark:border-slate-700 bg-yellow-50 dark:bg-blue-500/10 justify-between"
        >
          <div className="flex items-center">
            {" "}
            {/* Adicionado flex para alinhar o index com o código */}
            <span className="text-sm opacity-50 w-4 font-mono border-r border-slate-700 mr-2">
              {index + 1}
            </span>
            {/* Indentação Dinâmica */}
            <SyntaxHighlighterCustom
              showLineNumbers={false}
              language={data.language}
            >
              {linhaIdentada}
            </SyntaxHighlighterCustom>
          </div>

          <TrashButton onClick={() => removerLinha(index)} />
        </div>
      );
    };

    return (
      <div className="flex flex-col gap-2 w-full">
        <div
          className="flex flex-col gap-2 min-h-37.5 p-2 md:p-4 rounded-lg border-2 border-dashed
        bg-olive-50 dark:bg-slate-900 border-slate-300  dark:border-slate-700"
        >
          {selecionadas.length === 0 && (
            <p className="text-slate-400 lg:text-sm italic m-auto">
              Clique nas linhas abaixo para construir o código...
            </p>
          )}

          <DragDropList<RearrangeRow & { id: number }>
            items={getRowsPlusId(selecionadas)}
            onReorder={handleReorder}
            renderItem={RenderRowItem}
            getItemId={(task) => task.id}
          />
        </div>

        {/* Controles de Edição */}
        <div className="flex gap-4 justify-end">
          <TrashButton
            onClick={removerUltima}
            disabled={selecionadas.length === 0}
          />
          <NegativeActionButton
            onClick={resetar}
            text="Limpar tudo"
            icon={<RotateCcw size={14} />}
            disabled={selecionadas.length === 0}
          />
        </div>

        {/* Opções Disponíveis */}
        <div className="grid gap-4">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Linhas disponíveis:
          </p>

          <div className="flex flex-wrap gap-2 min-h-8">
            {opcoesDisponiveis.length > 0 &&
              opcoesDisponiveis.map((linha, index) => (
                <button
                  key={`RearrangeQuestion-${index}`}
                  onClick={() => adicionarLinha(linha)}
                  className="px-2 rounded-lg border font-mono transition-all cursor-pointer
                bg-white border-slate-200 hover:border-blue-500 text-slate-700 dark:text-blue-300
                dark:bg-slate-800 dark:border-slate-700 dark:hover:border-blue-400 "
                >
                  <SyntaxHighlighterCustom
                    showLineNumbers={false}
                    language={data.language}
                  >
                    {linha.text}
                  </SyntaxHighlighterCustom>
                </button>
              ))}
            {opcoesDisponiveis.length === 0 && (
              <p className="text-sm italic text-slate-700 dark:text-blue-300">
                Nenhuma linha disponível
              </p>
            )}
          </div>
          <Hint>Clique na linha.</Hint>
        </div>
        <ButtonConfirm
          onClick={handleConfirmar}
          disabled={!isAbleToAnswer || opcoesDisponiveis.length > 0}
          disabledText={`Faltam ${opcoesDisponiveis.length} linhas`}
          className="mt-4"
        />
      </div>
    );
  },
});
