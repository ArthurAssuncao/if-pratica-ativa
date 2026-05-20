import { QUESTION_TITLE_EMPTY } from "../../../constants/questions";
import type { QuestionFill } from "../../../types/study";
import { CodeEditorCustom } from "../../ui/CodeEditorCustom";
import { Hint } from "../../ui/Hint";
import { Input } from "../../ui/Input";
import { TextArea } from "../../ui/TextArea";

interface QuestionFillEditorProps {
  questionFill: QuestionFill;
  setQuestionFill: React.Dispatch<React.SetStateAction<QuestionFill>>;
}

export const QuestionFillEditor = ({
  questionFill,
  setQuestionFill,
}: QuestionFillEditorProps) => {
  const getAnswer = (code: string): string => {
    // pega o texto entre [[ ]] e retorna o conteúdo
    const regex = /\[\[(.*?)\]\]/g;
    const matches = code.match(regex);
    if (matches && matches.length > 0) {
      return matches[0].replace("[[", "").replace("]]", "");
    }
    return "";
  };

  return (
    <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-2">
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Enunciado / Pergunta
        </label>
        <TextArea
          className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800  h-24 text-sm focus:ring-2 focus:ring-blue-500"
          value={
            questionFill.questionText === QUESTION_TITLE_EMPTY
              ? ""
              : questionFill.questionText
          }
          placeholder="Descreva o que o aluno deve fazer..."
          onChange={(e) =>
            setQuestionFill({
              ...questionFill,
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
            value={questionFill.code}
            language={questionFill.language}
            displayLanguage={true}
            onChange={(evn) => {
              setQuestionFill({
                ...questionFill,
                code: evn.target.value,
                correctAnswer: { option: getAnswer(evn.target.value) },
              });
            }}
            placeholder="Digite o código"
          />
          <Hint>
            Use [[resposta]] para marcar espaços da lacuna a ser preenchida.
          </Hint>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Resposta
        </label>
        <Input
          className="text-sm"
          readonly
          value={questionFill.correctAnswer.option.toString()}
        />
        <Hint>
          Não pode editar aqui. Use [[resposta]] no código para marcar espaços
          da lacuna a ser preenchida.
        </Hint>
      </div>

      <div className="pt-4">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Explicação (Feedback)
        </label>
        <TextArea
          className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-none h-20 text-sm italic"
          placeholder="Por que esta resposta está correta/incorreta?"
          value={questionFill.explanation}
          onChange={(e) =>
            setQuestionFill({
              ...questionFill,
              explanation: e.target.value,
            })
          }
        />
      </div>
    </div>
  );
};
