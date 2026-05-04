import { BarChart3, Play, Settings2, Tally5, Type } from "lucide-react";
import { useMemo } from "react";
import type { Amount, QuizConfig } from "types/quiz";
import type { Level, Question, QuestionType } from "types/study";
import { rangeStartEnd } from "../util/util";
import { MultiOptionToggle } from "./ui/MultiOptionToggle";
import { OptionSlider } from "./ui/OptionSlider";

interface QuizConfiguratorProps {
  config: QuizConfig;
  sectionEnabled: boolean;
  questions: Question[];
  onConfigChange: (partial: Partial<QuizConfig>) => void;
  onStart: () => void;
}

export function QuizConfigurator({
  config,
  sectionEnabled,
  questions,
  onConfigChange,
  onStart,
}: QuizConfiguratorProps) {
  const totalQuestions = useMemo(() => questions.length, [questions]);
  const minQuestionsCount =
    totalQuestions % 4 === 0
      ? totalQuestions / 4
      : Math.ceil(totalQuestions / 4);
  const maxQuestionsCountOptions =
    totalQuestions > 0
      ? rangeStartEnd(minQuestionsCount, totalQuestions, minQuestionsCount)
      : [];

  const questionTypes: Array<QuestionType> = Array.from(
    new Set(questions.map((q) => q.type)).values(),
  ).sort();

  return (
    <section
      className={`transition-opacity duration-300 ${
        sectionEnabled
          ? "opacity-100 **:cursor-auto"
          : "opacity-40 **:pointer-not-allowed"
      }`}
    >
      <div className="flex items-center gap-2 mb-6">
        <Settings2 size={20} className="text-blue-500" />
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
          Configurações do Quiz
        </h2>
      </div>

      <div className="mb-6">
        <label className="flex items-center gap-2 text-sm font-bold text-slate-500 uppercase tracking-tighter mb-3">
          <BarChart3 size={14} /> Nível de Dificuldade
        </label>
        <OptionSlider
          options={["Fácil", "Médio", "Difícil", "Todas"]}
          value={config.level || "Todas"}
          disabled={!sectionEnabled}
          onChange={(value) => onConfigChange({ level: value as Level })}
        />
      </div>

      <div className="mb-6">
        <label className="flex items-center gap-2 text-sm font-bold text-slate-500 uppercase tracking-tighter mb-3">
          <Tally5 size={14} /> Quantidade de Questões
        </label>
        <OptionSlider
          options={[...maxQuestionsCountOptions, "Livre"]}
          value={config.amount || "Livre"}
          disabled={!sectionEnabled}
          onChange={(value) => onConfigChange({ amount: value as Amount })}
        />
      </div>

      <div className="mb-8">
        <label className="flex items-center gap-2 text-sm font-bold text-slate-500 uppercase tracking-tighter mb-3">
          <Type size={14} /> Tipo de questão
        </label>
        <MultiOptionToggle<QuestionType | "Todos">
          options={[...questionTypes, "Todos"]}
          allOptionValue="Todos"
          exclude={["fluxograma"]}
          selectedValues={
            config.questionsType && config.questionsType.length > 0
              ? config.questionsType
              : [...questionTypes, "Todos"]
          }
          onChange={(value) =>
            onConfigChange({ questionsType: value as QuestionType[] })
          }
        />
      </div>

      <button
        onClick={onStart}
        disabled={!sectionEnabled || totalQuestions === 0 || !questions}
        className={`
          w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-bold text-lg shadow-lg transition-all
          ${
            sectionEnabled
              ? "bg-blue-600 hover:bg-blue-700 text-white translate-y-0 hover:cursor-pointer"
              : "bg-slate-200 dark:bg-slate-800 text-slate-400 hover:cursor-not-allowed"
          }
        `}
      >
        Começar {config.amount === "Livre" ? "" : config.amount} questões
        <Play size={20} fill="currentColor" />
      </button>
    </section>
  );
}
