import type { QuestionMultipleChoice } from "../../../types/study";
import { ButtonAdd } from "../../ui/ButtonAdd";
import { Input } from "../../ui/Input";
import { Radio } from "../../ui/Radio";
import { TextArea } from "../../ui/TextArea";
import { TrashButton } from "../../ui/TrashButton";

interface QuestionMultipleChoiceEditorProps {
  questionMultipleChoice: QuestionMultipleChoice;
  setQuestionMultipleChoice: React.Dispatch<
    React.SetStateAction<QuestionMultipleChoice>
  >;
}

export const QuestionMultipleChoiceEditor = ({
  questionMultipleChoice,
  setQuestionMultipleChoice,
}: QuestionMultipleChoiceEditorProps) => {
  const addOptionMultiplaEscolha = () =>
    setQuestionMultipleChoice({
      ...questionMultipleChoice,
      options: [...questionMultipleChoice.options, ""],
    });

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
      <div className="space-y-1.5">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Enunciado / Pergunta
        </label>
        <TextArea
          className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800  h-24 text-sm focus:ring-2 focus:ring-blue-500"
          placeholder="Descreva o que o aluno deve fazer..."
          onChange={(e) =>
            setQuestionMultipleChoice({
              ...questionMultipleChoice,
              questionText: e.target.value,
            })
          }
        />
      </div>
      <div className="flex justify-between items-center">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Opções de Resposta
        </label>
        <ButtonAdd onClick={addOptionMultiplaEscolha}>
          + Adicionar alternativa
        </ButtonAdd>
      </div>
      <div className="space-y-2">
        {questionMultipleChoice.options.map((opt, i) => {
          const key = `questionMultipleChoice-${i}`;
          return (
            <div key={key} className="flex gap-2 group">
              <div className="w-10 h-10 flex items-center justify-center  bg-slate-100 dark:bg-slate-800 rounded-xl ">
                <Radio
                  type="radio"
                  name="correct"
                  value={opt}
                  checked={
                    questionMultipleChoice.correctAnswer.option !== "" &&
                    opt === questionMultipleChoice.correctAnswer.option
                  }
                  className=""
                  onChange={(e) => {
                    setQuestionMultipleChoice({
                      ...questionMultipleChoice,
                      correctAnswer: { option: e.target.value },
                    });
                  }}
                />
              </div>
              <Input
                type="text"
                className="flex-1 p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm "
                placeholder={`Alternativa ${i + 1}`}
                value={opt}
                onChange={(e) => {
                  const newOptions = [...questionMultipleChoice.options];
                  newOptions[i] = e.target.value;
                  setQuestionMultipleChoice({
                    ...questionMultipleChoice,
                    options: newOptions,
                  });
                }}
              />
              <TrashButton
                onClick={() =>
                  setQuestionMultipleChoice({
                    ...questionMultipleChoice,
                    options: questionMultipleChoice.options.filter(
                      (_, index) => index !== i,
                    ),
                  })
                }
              />
            </div>
          );
        })}
      </div>
      <div className="space-y-1.5 pt-4">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Explicação (Feedback)
        </label>
        <TextArea
          className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-none h-20 text-sm italic"
          placeholder="Por que esta resposta está correta/incorreta?"
          value={questionMultipleChoice.explanation}
          onChange={(e) =>
            setQuestionMultipleChoice({
              ...questionMultipleChoice,
              explanation: e.target.value,
            })
          }
        />
      </div>
    </div>
  );
};
