import { Code, ListPlus, Rows3 } from "lucide-react";
import { useState } from "react";
import { LANGUAGES } from "../../../constants/code";
import { INDENTATION_SIZE } from "../../../constants/general";
import type {
  Languages,
  QuestionClickOnError,
  RearrangeRow,
} from "../../../types/study";
import { clickOnErrorEditorDefineId } from "../../../util/answer";
import { countIndentationLevel } from "../../../util/code";
import { ButtonAdd } from "../../ui/ButtonAdd";
import { CodeEditorCustom } from "../../ui/CodeEditorCustom";
import DragDropList from "../../ui/DragDropList";
import { Hint } from "../../ui/Hint";
import { Select } from "../../ui/Select";
import { TextArea } from "../../ui/TextArea";
import { ClickOnErrorRenderRowItem } from "./QuestionClickOnErrorEditorComponents/ClickOnErrorRenderRowItem";

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

  const [stableIds, setStableIds] = useState(() =>
    questionClickOnError.rows.map(() => crypto.randomUUID()),
  );

  const addRow = () => {
    if (!isEditingLinePerLine) {
      setIsEditingLinePerLine(true);
      return;
    }
    setQuestionClickOnError({
      ...questionClickOnError,
      rows: [...questionClickOnError.rows, { text: "", identationLevel: 0 }],
    });
    setStableIds((prev) => [...prev, crypto.randomUUID()]);
  };

  const setLinesByCode = (code: string) => {
    const lines = code.split("\n");
    const rows = lines.map((line) => {
      const row = {
        text: line.trim(),
        identationLevel: countIndentationLevel(line),
      } as RearrangeRow;

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

  const getRowsPlusId = (rows: RearrangeRow[]) => {
    return rows.map((row, index) => ({
      ...row,
      id: clickOnErrorEditorDefineId(stableIds, index).toString(),
    }));
  };

  const handleReorder = (rows: RearrangeRow[]) => {
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
            {isEditingLinePerLine && (
              <DragDropList<RearrangeRow & { id: string }>
                key={questionClickOnError.rows.length}
                items={getRowsPlusId(questionClickOnError.rows)}
                onReorder={handleReorder}
                renderItem={(row, index) => (
                  <ClickOnErrorRenderRowItem
                    indexRow={index}
                    row={row}
                    questionClickOnError={questionClickOnError}
                    setQuestionClickOnError={setQuestionClickOnError}
                    stableIds={stableIds}
                  />
                )}
              />
            )}
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
          Explicação (Feedback)
        </label>
        <TextArea
          className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-none h-20 text-sm italic"
          placeholder="Por que esta resposta está correta/incorreta?"
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
