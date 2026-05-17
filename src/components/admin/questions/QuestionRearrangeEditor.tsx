import { Code, ListPlus, Rows3 } from "lucide-react";
import { useState } from "react";
import { LANGUAGES } from "../../../constants/code";
import { INDENTATION_SIZE } from "../../../constants/general";
import type {
  Languages,
  QuestionRearrange,
  RearrangeRow,
} from "../../../types/study";
import { countIndentationLevel } from "../../../util/code";
import { ButtonAdd } from "../../ui/ButtonAdd";
import { Checkbox } from "../../ui/Checkbox";
import { CodeEditorCustom } from "../../ui/CodeEditorCustom";
import DragDropList from "../../ui/DragDropList";
import { Hint } from "../../ui/Hint";
import { Input } from "../../ui/Input";
import { Select } from "../../ui/Select";
import { TextArea } from "../../ui/TextArea";
import { TrashButton } from "../../ui/TrashButton";

interface QuestionRearrangeEditorProps {
  questionRearrange: QuestionRearrange;
  setQuestionRearrange: React.Dispatch<React.SetStateAction<QuestionRearrange>>;
}

export const QuestionRearrangeEditor = ({
  questionRearrange,
  setQuestionRearrange,
}: QuestionRearrangeEditorProps) => {
  const [isEditingLinePerLine, setIsEditingLinePerLine] = useState(true);

  const addRow = () => {
    if (!isEditingLinePerLine) {
      setIsEditingLinePerLine(true);
      return;
    }
    setQuestionRearrange({
      ...questionRearrange,
      rows: [...questionRearrange.rows, { text: "", identationLevel: 0 }],
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
    setQuestionRearrange({
      ...questionRearrange,
      rows: rows,
    });
  };

  const getRowsPlusId = (rows: RearrangeRow[]) => {
    return rows.map((row, index) => ({ ...row, id: index }));
  };

  const handleReorder = (rows: RearrangeRow[]) => {
    setQuestionRearrange({
      ...questionRearrange,
      rows: rows,
    });
  };

  const RenderRowItem = (row: RearrangeRow & { id: number }) => {
    const i = row.id;

    return (
      <div key={row.id} className="flex flex-col gap-2 w-full">
        <div className="flex gap-2 w-full items-center bg-slate-50 dark:bg-slate-800/40 p-2 rounded-lg border border-blue-200 dark:border-slate-800">
          <Input
            type="number"
            min={0}
            value={row.identationLevel}
            fullWidth={false}
            className="w-16 p-1.5 bg-white dark:bg-slate-900 rounded-lg text-xs text-center"
            placeholder="Tab"
            title="Nível de Indentação"
            onChange={(e) => {
              setQuestionRearrange({
                ...questionRearrange,
                rows: questionRearrange.rows.map((row, index) =>
                  index === i
                    ? {
                        ...row,
                        identationLevel: Number(e.target.value),
                      }
                    : row,
                ),
              });
            }}
          />
          <Input
            // ref={inputRef}
            type="text"
            className="flex-1 p-1.5 bg-white dark:bg-slate-900 rounded-lg text-sm "
            placeholder="Código ou texto da linha..."
            value={row.text}
            onChange={(e) => {
              setQuestionRearrange({
                ...questionRearrange,
                rows: questionRearrange.rows.map((row, index) =>
                  index === i
                    ? {
                        ...row,
                        text: e.target.value,
                      }
                    : row,
                ),
              });
            }}
          />

          <Checkbox
            type="checkbox"
            checkboxSize="xl"
            title="É a linha com erro?"
            className="accent-rose-500"
            value={row.text}
            checked={row.text === questionRearrange.correctAnswer || false}
            onChange={(e) =>
              setQuestionRearrange({
                ...questionRearrange,
                correctAnswer: e.target.value,
              })
            }
          />

          <TrashButton
            onClick={() =>
              setQuestionRearrange({
                ...questionRearrange,
                rows: questionRearrange.rows.filter((_, index) => index !== i),
              })
            }
          />
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4 animate-in fade-in">
      <div className="flex flex-col gap-2">
        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Linguagem
          </label>
          <Select
            value={questionRearrange.language}
            options={LANGUAGES}
            defaultValue={questionRearrange.language}
            onChange={(value) => {
              setQuestionRearrange({
                ...questionRearrange,
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
            {isEditingLinePerLine && (
              <DragDropList<RearrangeRow & { id: number }>
                items={getRowsPlusId(questionRearrange.rows)}
                onReorder={handleReorder}
                renderItem={RenderRowItem}
                getItemId={(row) => row.id}
              />
            )}
            <Hint>Indique o nível de indentação no primeiro campo.</Hint>
            <Hint>Use o checkbox para marcar a linha com erro.</Hint>
          </div>
        )}
        {!isEditingLinePerLine && (
          <div className="flex flex-col gap-2 items-center bg-slate-50 dark:bg-slate-800/40 p-2 rounded-xl border border-slate-100 dark:border-slate-800">
            <CodeEditorCustom
              value={questionRearrange.rows
                .map((row) => row.text)
                .join("\n")
                .trim()}
              language={questionRearrange.language}
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
          Explicação (Feedback)
        </label>
        <TextArea
          className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-none h-20 text-sm italic"
          placeholder="Por que esta resposta está correta/incorreta?"
          value={questionRearrange.explanation}
          onChange={(e) =>
            setQuestionRearrange({
              ...questionRearrange,
              explanation: e.target.value,
            })
          }
        />
      </div>
    </div>
  );
};
