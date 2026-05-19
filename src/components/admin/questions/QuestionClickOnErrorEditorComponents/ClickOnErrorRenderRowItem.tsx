import type {
  CorrectAnswer,
  QuestionClickOnError,
  RearrangeRow,
} from "../../../../types/study";
import { clickOnErrorEditorDefineId } from "../../../../util/answer";
import { Checkbox } from "../../../ui/Checkbox";
import { Input } from "../../../ui/Input";
import { TrashButton } from "../../../ui/TrashButton";

interface ClickOnErrorRenderRowItemProps {
  indexRow: number;
  row: RearrangeRow & { id: string };
  questionClickOnError: QuestionClickOnError;
  setQuestionClickOnError: React.Dispatch<
    React.SetStateAction<QuestionClickOnError>
  >;
  stableIds: string[] | number[];
}

export const ClickOnErrorRenderRowItem = ({
  indexRow,
  row,
  questionClickOnError,
  setQuestionClickOnError,
  stableIds,
}: ClickOnErrorRenderRowItemProps) => {
  const idRow = row.id;

  const isCorrectAnswerWithText = (
    correctAnswer: CorrectAnswer,
  ): correctAnswer is { option: number; text: string } => {
    return (
      typeof correctAnswer === "object" &&
      correctAnswer !== null &&
      "text" in correctAnswer
    );
  };

  const isCorrectAnswer = (
    id: number,
    text: string,
    correctAnswer: CorrectAnswer,
  ): boolean => {
    if (isCorrectAnswerWithText(correctAnswer)) {
      return correctAnswer.text === text && correctAnswer.option === id;
    }
    return false;
  };

  return (
    <div key={idRow} className="flex flex-col gap-2 w-full">
      <div className="flex gap-2 w-full items-center bg-slate-50 dark:bg-slate-800/40 p-2 rounded-lg border border-blue-200 dark:border-slate-800">
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
                clickOnErrorEditorDefineId(stableIds, index) === idRow
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
                clickOnErrorEditorDefineId(stableIds, index) === idRow
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
            isCorrectAnswer(
              indexRow,
              row.text,
              questionClickOnError.correctAnswer,
            ) || false
          }
          onChange={(e) =>
            setQuestionClickOnError({
              ...questionClickOnError,
              correctAnswer: {
                option: indexRow,
                text: e.target.value,
              },
            })
          }
        />

        <TrashButton
          onClick={() =>
            setQuestionClickOnError({
              ...questionClickOnError,
              rows: questionClickOnError.rows.filter(
                (_, index) =>
                  clickOnErrorEditorDefineId(stableIds, index) !== idRow,
              ),
            })
          }
        />
      </div>
    </div>
  );
};
