import type {
  QuestionClickOnError,
  QuestionMultipleChoice,
} from "../types/study";

export const QUESTION_MULTIPLE_CHOICE_EMPTY: QuestionMultipleChoice = {
  id: 0,
  type: "multipla_escolha",
  level: "iniciante",
  options: ["", ""],
  questionText:
    "O enunciado da questão aparecerá aqui conforme você digita no editor...",
  explanation: "",
  correctAnswer: "",
  info: {
    status: "pendente",
    attemptCount: 0,
  },
  language: "pt-br",
};

export const QUESTION_CLICK_ON_ERROR_EMPTY: QuestionClickOnError = {
  id: 0,
  type: "clique_erro",
  level: "iniciante",
  questionText:
    "O enunciado da questão aparecerá aqui conforme você digita no editor...",
  explanation: "",
  correctAnswer: 0,
  info: {
    status: "pendente",
    attemptCount: 0,
  },
  rows: [{ text: "", identationLevel: 0 }],
  language: "python",
};

export const QUESTION_TRUE_FALSE_EMPTY: QuestionMultipleChoice = {
  id: 0,
  type: "verdadeiro_falso",
  level: "iniciante",
  options: ["", ""],
  questionText:
    "O enunciado da questão aparecerá aqui conforme você digita no editor...",
  explanation: "",
  correctAnswer: "",
  info: {
    status: "pendente",
    attemptCount: 0,
  },
  language: "pt-br",
};
