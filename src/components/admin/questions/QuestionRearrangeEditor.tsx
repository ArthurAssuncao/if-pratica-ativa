import { Code, ListPlus, Rows3 } from "lucide-react";
import { useEffect, useState } from "react";
import { LANGUAGES } from "../../../constants/code";
import { INDENTATION_SIZE } from "../../../constants/general";
import type {
  Languages,
  QuestionRearrange,
  RearrangeRow,
} from "../../../types/study";
import {
  clickOnErrorEditorDefineId,
  rearrangeAnswer,
} from "../../../util/answer";
import { countIndentationLevel } from "../../../util/code";
import { ButtonAdd } from "../../ui/ButtonAdd";
import { CodeEditorCustom } from "../../ui/CodeEditorCustom";
import DragDropList from "../../ui/DragDropList";
import { Hint } from "../../ui/Hint";
import { Select } from "../../ui/Select";
import { TextArea } from "../../ui/TextArea";
import { RearrangeRenderRowItem } from "./QuestionRearrangeEditorComponents/RearrangeRenderRowItem";

interface QuestionRearrangeEditorProps {
  questionRearrange: QuestionRearrange;
  setQuestionRearrange: React.Dispatch<React.SetStateAction<QuestionRearrange>>;
}

export const QuestionRearrangeEditor = ({
  questionRearrange,
  setQuestionRearrange,
}: QuestionRearrangeEditorProps) => {
  const [isEditingLinePerLine, setIsEditingLinePerLine] = useState(true);

  const [stableIds, setStableIds] = useState(() =>
    questionRearrange.rows.map(() => crypto.randomUUID()),
  );

  const addRow = () => {
    if (!isEditingLinePerLine) {
      setIsEditingLinePerLine(true);
      return;
    }
    setQuestionRearrange({
      ...questionRearrange,
      rows: [...questionRearrange.rows, { text: "", identationLevel: 0 }],
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
    setQuestionRearrange({
      ...questionRearrange,
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
    setQuestionRearrange({
      ...questionRearrange,
      rows: rows,
    });
  };

  useEffect(() => {
    setQuestionRearrange({
      ...questionRearrange,
      correctAnswer: {
        option: rearrangeAnswer(questionRearrange.rows),
        text: rearrangeAnswer(questionRearrange.rows),
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionRearrange.rows, setQuestionRearrange]);

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
              <DragDropList<RearrangeRow & { id: string }>
                key={questionRearrange.rows.length}
                items={getRowsPlusId(questionRearrange.rows)}
                onReorder={handleReorder}
                renderItem={(row, index) => (
                  <RearrangeRenderRowItem
                    indexRow={index}
                    row={row}
                    questionRearrange={questionRearrange}
                    setQuestionRearrange={setQuestionRearrange}
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
