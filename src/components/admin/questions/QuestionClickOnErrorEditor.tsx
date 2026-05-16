import { Code, GripVertical, ListPlus, Rows3 } from "lucide-react";
import { useState } from "react";
import { LANGUAGES } from "../../../constants/code";
import { INDENTATION_SIZE } from "../../../constants/general";
import type {
  Languages,
  QuestionClickOnError,
  RearrangeRow,
} from "../../../types/study";
import { countIndentationLevel } from "../../../util/code";
import { ButtonAdd } from "../../ui/ButtonAdd";
import { Checkbox } from "../../ui/Checkbox";
import { CodeEditorCustom } from "../../ui/CodeEditorCustom";
import { Hint } from "../../ui/Hint";
import { Input } from "../../ui/Input";
import { Select } from "../../ui/Select";
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
  const [isEditingLinePerLine, setIsEditingLinePerLine] = useState(true);

  const addRow = () => {
    if (!isEditingLinePerLine) {
      setIsEditingLinePerLine(true);
      return;
    }
    setQuestionClickOnError({
      ...questionClickOnError,
      rows: [...questionClickOnError.rows, { text: "", identationLevel: 0 }],
    });
  };

  const setLinesByCode = (code: string) => {
    const lines = code.split("\n");
    const rows = lines.map((line) => {
      const row = {
        text: line.trim(),
        identationLevel: countIndentationLevel(line),
      } as RearrangeRow;
      console.log(row);
      return row;
    });
    // remove a ultiam linha se for vazia
    if (rows[rows.length - 1].text === "") {
      rows.pop();
    }
    setQuestionClickOnError({
      ...questionClickOnError,
      rows: rows,
    });
  };

  return (
    <div className="flex flex-col gap-4 animate-in fade-in">
      <div className="flex flex-col gap-2">
        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Linguagem
          </label>
          <Select
            value={questionClickOnError.language}
            options={LANGUAGES}
            defaultValue={questionClickOnError.language}
            onChange={(value) => {
              setQuestionClickOnError({
                ...questionClickOnError,
                language: value as Languages,
              });
            }}
          />
        </div>
        <div className="flex justify-between items-center">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Linhas de Informação
          </label>
          <div className="flex gap-2">
            <ButtonAdd onClick={addRow}>
              {isEditingLinePerLine ? (
                <span className="flex gap-1 items-center justify-center">
                  <ListPlus size={16} />
                  Nova Linha
                </span>
              ) : (
                <span className="flex gap-1 items-center justify-center">
                  <Rows3 size={16} /> Visualizar linhas
                </span>
              )}
            </ButtonAdd>
            <ButtonAdd onClick={() => setIsEditingLinePerLine(false)}>
              <span className="flex gap-1 items-center justify-center">
                <Code size={16} /> Visualizar código completo
              </span>
            </ButtonAdd>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        {isEditingLinePerLine && (
          <div className="flex flex-col gap-2 items-center bg-slate-50 dark:bg-slate-800/40 p-2 rounded-xl border border-slate-100 dark:border-slate-800">
            {isEditingLinePerLine &&
              questionClickOnError.rows.map((row, i) => (
                <div key={i} className="flex flex-col gap-2 w-full">
                  <div className="flex gap-2 w-full items-center bg-slate-50 dark:bg-slate-800/40 p-2 rounded-xl border border-blue-200 dark:border-slate-800">
                    <GripVertical
                      size={24}
                      className="text-slate-300 cursor-grab"
                    />
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
                      checked={
                        row.text === questionClickOnError.correctAnswer || false
                      }
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
                </div>
              ))}
            <Hint>Indique o nível de indentação no primeiro campo.</Hint>
            <Hint>Use o checkbox para marcar a linha com erro.</Hint>
          </div>
        )}
        {!isEditingLinePerLine && (
          <div className="flex flex-col gap-2 items-center bg-slate-50 dark:bg-slate-800/40 p-2 rounded-xl border border-slate-100 dark:border-slate-800">
            <CodeEditorCustom
              value={questionClickOnError.rows
                .map((row) => row.text)
                .join("\n")
                .trim()}
              language={questionClickOnError.language}
              displayLanguage={true}
              onChange={(evn) => {
                setLinesByCode(evn.target.value);
              }}
            />

            <Hint>Ao digitar, todas as linhas serão substituídas.</Hint>
            <Hint>
              {`Cada nível de indentação será calculado a cada ${INDENTATION_SIZE} espaços ou 1 tabulação`}
            </Hint>
          </div>
        )}
      </div>

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
