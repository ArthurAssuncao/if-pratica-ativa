import toast from "react-hot-toast";
import type { QuestionMultipleChoice } from "../../../types/study";
import { ButtonAdd } from "../../ui/ButtonAdd";
import { Input } from "../../ui/Input";
import { Radio } from "../../ui/Radio";
import { TextArea } from "../../ui/TextArea";
import { TrashButton } from "../../ui/TrashButton";

interface QuestionTrueFalseEditorProps {
  questionTrueFalse: QuestionMultipleChoice;
  setQuestionTrueFalse: React.Dispatch<
    React.SetStateAction<QuestionMultipleChoice>
  >;
}

export const QuestionTrueFalseEditor = ({
  questionTrueFalse,
  setQuestionTrueFalse,
}: QuestionTrueFalseEditorProps) => {
  const addOptionMultiplaEscolha = () => {
    if (questionTrueFalse.options.length >= 2) {
      toast.error(
        "Você não pode adicionar mais de duas opções em um Verdadeiro ou Falso!",
      );
      return;
    }
    setQuestionTrueFalse({
      ...questionTrueFalse,
      options: [...questionTrueFalse.options, ""],
    });
  };

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
            setQuestionTrueFalse({
              ...questionTrueFalse,
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
        {questionTrueFalse.options.map((opt, i) => (
          <div key={i} className="flex gap-2 group">
            <div className="w-10 h-10 flex items-center justify-center  bg-slate-100 dark:bg-slate-800 rounded-xl ">
              <Radio
                type="radio"
                name="correct"
                value={opt}
                checked={
                  questionTrueFalse.correctAnswer !== "" &&
                  opt === questionTrueFalse.correctAnswer
                }
                className=""
                onChange={(e) => {
                  setQuestionTrueFalse({
                    ...questionTrueFalse,
                    correctAnswer: e.target.value,
                  });
                  console.log(questionTrueFalse.correctAnswer);
                }}
              />
            </div>
            <Input
              type="text"
              className="flex-1 p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm "
              placeholder={`Alternativa ${i + 1}`}
              value={opt}
              onChange={(e) => {
                const newOptions = [...questionTrueFalse.options];
                newOptions[i] = e.target.value;
                setQuestionTrueFalse({
                  ...questionTrueFalse,
                  options: newOptions,
                });
              }}
            />
            <TrashButton
              onClick={() =>
                setQuestionTrueFalse({
                  ...questionTrueFalse,
                  options: questionTrueFalse.options.filter(
                    (_, index) => index !== i,
                  ),
                })
              }
            />
          </div>
        ))}
      </div>
      <div className="space-y-1.5 pt-4">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Explicação (Feedback)
        </label>
        <TextArea
          className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-none h-20 text-sm italic"
          placeholder="Por que esta resposta está correta/incorreta?"
          value={questionTrueFalse.explanation}
          onChange={(e) =>
            setQuestionTrueFalse({
              ...questionTrueFalse,
              explanation: e.target.value,
            })
          }
        />
      </div>
    </div>
  );
};
