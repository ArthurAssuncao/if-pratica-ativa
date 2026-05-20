import type { QuestionOutput } from "../../../types/study";
import { CodeEditorCustom } from "../../ui/CodeEditorCustom";
import { TextArea } from "../../ui/TextArea";

interface QuestionOutputEditorProps {
  questionOutput: QuestionOutput;
  setQuestionOutput: React.Dispatch<React.SetStateAction<QuestionOutput>>;
}

export const QuestionOutputEditor = ({
  questionOutput,
  setQuestionOutput,
}: QuestionOutputEditorProps) => {
  return (
    <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-2">
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Enunciado / Pergunta
        </label>
        <TextArea
          className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800  h-24 text-sm focus:ring-2 focus:ring-blue-500"
          placeholder="Descreva o que o aluno deve fazer..."
          onChange={(e) =>
            setQuestionOutput({
              ...questionOutput,
              questionText: e.target.value,
            })
          }
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Código
        </label>

        <div className="flex flex-col gap-2 bg-slate-50 dark:bg-slate-800/40 p-2 rounded-xl border border-slate-100 dark:border-slate-800">
          <CodeEditorCustom
            value={questionOutput.code}
            language={questionOutput.language}
            displayLanguage={true}
            onChange={(evn) => {
              setQuestionOutput({
                ...questionOutput,
                code: evn.target.value,
              });
            }}
            placeholder="Digite o código"
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Resposta
        </label>
        <TextArea
          className="text-sm"
          value={questionOutput.correctAnswer.option.toString()}
          onChange={(e) => {
            setQuestionOutput({
              ...questionOutput,
              correctAnswer: { option: e.target.value },
            });
          }}
        />
      </div>

      <div className="pt-4">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Explicação (Feedback)
        </label>
        <TextArea
          className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-none h-20 text-sm italic"
          placeholder="Por que esta resposta está correta/incorreta?"
          value={questionOutput.explanation}
          onChange={(e) =>
            setQuestionOutput({
              ...questionOutput,
              explanation: e.target.value,
            })
          }
        />
      </div>
    </div>
  );
};
