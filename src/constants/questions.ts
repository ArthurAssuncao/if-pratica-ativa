import type {
  QuestionClickOnError,
  QuestionFill,
  QuestionFlowchartnNew,
  QuestionMultipleChoice,
  QuestionOutput,
  QuestionRearrange,
} from "../types/study";

export const QUESTION_TITLE_EMPTY =
  "O enunciado da questão aparecerá aqui conforme você digita no editor...";

export const QUESTION_MULTIPLE_CHOICE_EMPTY: QuestionMultipleChoice = {
  id: 0,
  type: "multipla_escolha",
  level: "iniciante",
  options: ["", ""],
  questionText: QUESTION_TITLE_EMPTY,
  explanation: "",
  correctAnswer: { option: "" },
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
  questionText: QUESTION_TITLE_EMPTY,
  explanation: "",
  correctAnswer: { option: 0 },
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
  questionText: QUESTION_TITLE_EMPTY,
  explanation: "",
  correctAnswer: { option: "" },
  info: {
    status: "pendente",
    attemptCount: 0,
  },
  language: "pt-br",
};

export const QUESTION_REARRANGE_EMPTY: QuestionRearrange = {
  id: 0,
  type: "ordenacao",
  level: "iniciante",
  questionText: QUESTION_TITLE_EMPTY,
  explanation: "",
  correctAnswer: { option: "" },
  info: {
    status: "pendente",
    attemptCount: 0,
  },
  rows: [{ text: "", identationLevel: 0 }],
  language: "python",
};

export const QUESTION_OUTPUT_EMPTY: QuestionOutput = {
  id: 0,
  type: "predicao",
  level: "iniciante",
  questionText: QUESTION_TITLE_EMPTY,
  explanation: "",
  correctAnswer: { option: "" },
  info: {
    status: "pendente",
    attemptCount: 0,
  },
  code: "",
  language: "python",
};

export const QUESTION_FILL_EMPTY: QuestionFill = {
  id: 0,
  type: "lacuna",
  level: "iniciante",
  questionText: QUESTION_TITLE_EMPTY,
  explanation: "",
  correctAnswer: { option: "" },
  info: {
    status: "pendente",
    attemptCount: 0,
  },
  code: "",
  language: "python",
};

export const QUESTION_FLOWCHART_EMPTY: QuestionFlowchartnNew = {
  id: 0,
  type: "fluxograma_novo",
  level: "iniciante",
  questionText: QUESTION_TITLE_EMPTY,
  explanation: "",
  correctAnswer: { option: "" },
  info: {
    status: "pendente",
    attemptCount: 0,
  },
  language: "python",
  code: "nota = float(input('Nota: '))",
  root: "decisao_1",
  nodes: [
    {
      id: "decisao_1",
      text: "if nota >= 7:",
      type: "decisao",
    },
    {
      id: "decisao_2",
      text: "elif nota >= 5:",
      type: "decisao",
    },
    {
      id: "aprovado",
      text: "Aluno Aprovado",
      type: "terminal",
    },
    {
      id: "recuperacao",
      text: "Aluno em Recuperação",
      type: "terminal",
    },
    {
      id: "reprovado",
      text: "Aluno Reprovado",
      type: "terminal",
    },
  ],
  connections: [
    {
      to: "aprovado",
      from: "decisao_1",
      label: "Sim",
    },
    {
      to: "decisao_2",
      from: "decisao_1",
      label: "Não",
    },
    {
      to: "recuperacao",
      from: "decisao_2",
      label: "Sim",
    },
    {
      to: "reprovado",
      from: "decisao_2",
      label: "Não",
    },
  ],
};
