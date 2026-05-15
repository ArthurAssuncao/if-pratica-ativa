import { GripVertical } from "lucide-react";
import type { QuestionClickOnError } from "../../../types/study";
import { ButtonAdd } from "../../ui/ButtonAdd";
import { Checkbox } from "../../ui/Checkbox";
import { Input } from "../../ui/Input";
import { QuestionHint } from "../../ui/QuestionHint";
import { TextArea } from "../../ui/TextArea";
import { TrashButton } from "../../ui/TrashButton";

interface QuestionClickOnErrorEditorProps {
  questionClickOnError: QuestionClickOnError;
  setQuestionClickOnError: React.Dispatch<
    React.SetStateAction<QuestionClickOnError>
  >;
}

export const QuestionClickOnErrorEditor = ({
  questionClickOnError,
  setQuestionClickOnError,
}: QuestionClickOnErrorEditorProps) => {
  const addRow = () =>
    setQuestionClickOnError({
      ...questionClickOnError,
      rows: [...questionClickOnError.rows, { text: "", identationLevel: 0 }],
    });

  return (
    <div className="space-y-4 animate-in fade-in">
      <div className="flex justify-between items-center">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Linhas de Informação
        </label>
        <ButtonAdd onClick={addRow}>+ Nova Linha</ButtonAdd>
      </div>
      <div className="space-y-2">
        {questionClickOnError.rows.map((row, i) => (
          <div
            key={i}
            className="flex gap-2 items-center bg-slate-50 dark:bg-slate-800/40 p-2 rounded-xl border border-slate-100 dark:border-slate-800"
          >
            <GripVertical size={16} className="text-slate-300 cursor-grab" />
            <Input
              type="number"
              min={0}
              value={row.identationLevel}
              fullWidth={false}
              className="w-16 p-1.5 bg-white dark:bg-slate-900 rounded-lg text-xs text-center"
              placeholder="Tab"
              title="Nível de Indentação"
              onChange={(e) =>
                setQuestionClickOnError({
                  ...questionClickOnError,
                  rows: questionClickOnError.rows.map((row, index) =>
                    index === i
                      ? {
                          ...row,
                          identationLevel: Number(e.target.value),
                        }
                      : row,
                  ),
                })
              }
            />
            <Input
              type="text"
              className="flex-1 p-1.5 bg-white dark:bg-slate-900 rounded-lg text-sm "
              placeholder="Código ou texto da linha..."
              value={row.text}
              onChange={(e) =>
                setQuestionClickOnError({
                  ...questionClickOnError,
                  rows: questionClickOnError.rows.map((row, index) =>
                    index === i
                      ? {
                          ...row,
                          text: e.target.value,
                        }
                      : row,
                  ),
                })
              }
            />

            <Checkbox
              type="checkbox"
              checkboxSize="xl"
              title="É a linha com erro?"
              className="accent-rose-500"
              value={row.text}
              checked={row.text === questionClickOnError.correctAnswer || false}
              onChange={(e) =>
                setQuestionClickOnError({
                  ...questionClickOnError,
                  correctAnswer: e.target.value,
                })
              }
            />

            <TrashButton
              onClick={() =>
                setQuestionClickOnError({
                  ...questionClickOnError,
                  rows: questionClickOnError.rows.filter(
                    (_, index) => index !== i,
                  ),
                })
              }
            />
          </div>
        ))}
      </div>
      <QuestionHint>
        Indique o nível de indentação no primeiro campo.
      </QuestionHint>
      <QuestionHint>Use o checkbox para marcar a linha com erro.</QuestionHint>

      <div className="space-y-1.5 pt-4">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Explicação (Feedback Positivo)
        </label>
        <TextArea
          className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-none h-20 text-sm italic"
          placeholder="Por que esta resposta está correta?"
          value={questionClickOnError.explanation}
          onChange={(e) =>
            setQuestionClickOnError({
              ...questionClickOnError,
              explanation: e.target.value,
            })
          }
        />
      </div>
    </div>
  );
};
