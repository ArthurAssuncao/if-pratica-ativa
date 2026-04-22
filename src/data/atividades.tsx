import { Icon } from "@iconify/react";
import { QuizData, Quizes } from "types/quiz";
import { Discipline } from "types/study";

const quizesData: QuizData[] = [
  {
    tema: {
      id: 1,
      nome: "Fundamentos de Python",
      nivel: "iniciante",
    },
    questoes: [
      {
        id: 1,
        tipo: "multipla_escolha",
        pergunta: "Qual é o tipo de dado da variável `x = [1, 2, 3]`?",
        opcoes: [
          "tuple (tupla)",
          "set (conjunto)",
          "list (lista)",
          "dictionary (dicionário)",
        ],
        respostaCorreta: "list (lista)",
        nivel: "iniciante",
        explicacao: "",
      },
      {
        id: 2,
        tipo: "verdadeiro_falso",
        pergunta: "Em Python, a indentação é opcional.",
        opcoes: ["Verdadeiro", "Falso"],
        respostaCorreta: "Falso",
        nivel: "iniciante",
        explicacao: "",
      },
      {
        id: 3,
        tipo: "lacuna",
        pergunta: "Complete o código para iterar de 0 a 4:",
        codigo: "for i in _______(5):\n    print(i)",

        respostaCorreta: "range",
        nivel: "iniciante",
        explicacao: "",
      },
      {
        id: 4,
        tipo: "predicao",
        pergunta: "Qual será a saída deste código?",
        codigo: "x = 10\ny = 5\nprint(x // y)",
        respostaCorreta: "2",
        nivel: "iniciante",
        explicacao: "",
      },
      {
        id: 5,
        tipo: "ordenacao",
        pergunta: "Ordena as linhas para criar um loop que imprime de 0 a 2:",
        linhas: [
          { texto: "print(i)", identationLevel: 1 },
          { texto: "for i in range(3):", identationLevel: 0 },
        ],
        respostaCorreta: "for i in range(3):\nprint(i)",
        nivel: "iniciante",
        explicacao: "",
      },
      {
        id: 6,
        tipo: "clique_erro",
        pergunta: "Onde está o erro de sintaxe?",
        linhas: [
          { texto: "def somar(a)", identationLevel: 0 },
          { texto: "    return a + b", identationLevel: 1 },
          { texto: "print(somar(2,3))", identationLevel: 0 },
        ],
        respostaCorreta: "0",
        nivel: "iniciante",
        explicacao: "",
      },
      {
        id: 10,
        tipo: "fluxograma_novo",
        nivel: "iniciante",
        pergunta: "Se um aluno tirar nota 5.5, qual será o caminho percorrido?",
        codigo: "nota = float(input('Nota: '))",
        raiz: "decisao_1",
        nos: [
          { id: "decisao_1", tipo: "decisao", texto: "if nota >= 7:" },
          { id: "decisao_2", tipo: "decisao", texto: "elif nota >= 5:" },
          { id: "aprovado", tipo: "terminal", texto: "Aluno Aprovado" },
          {
            id: "recuperacao",
            tipo: "terminal",
            texto: "Aluno em Recuperação",
            correta: true,
          },
          { id: "reprovado", tipo: "terminal", texto: "Aluno Reprovado" },
        ],
        conexoes: [
          { de: "decisao_1", para: "aprovado", label: "Sim" },
          { de: "decisao_1", para: "decisao_2", label: "Não" },
          { de: "decisao_2", para: "recuperacao", label: "Sim" },
          { de: "decisao_2", para: "reprovado", label: "Não" },
        ],
        respostaCorreta: "Aluno em Recuperação",
        explicacao: "",
      },
    ],
  },
];

const generateQuizes = (quizesData: QuizData[]) => {
  const quizes: Quizes = {};

  quizesData.forEach((q) => {
    quizes[q.tema.id] = q;
  });

  return quizes;
};

export const DISCIPLINES: Discipline[] = [
  {
    id: "python",
    name: "Programação em Python",
    icon: <Icon icon="devicon:python-wordmark" />,
    contents: [
      { id: "tipos-basicos", name: "Tipos básicos, variáveis e operadores" },
      { id: "entrada-saida", name: "Entrada e saída" },
      { id: "condicionais", name: "Estruturas Condicionais" },
      { id: "repeticao", name: "Estruturas de Repetição" },
      { id: "funcoes", name: "Funções" },
      { id: "estruturas-dados", name: "Estruturas de Dados" },
    ],
  },
  {
    id: "informatica",
    name: "Informática Básica",
    icon: <Icon icon="noto:desktop-computer" />,
    contents: [
      { id: "hardware", name: "Hardware" },
      { id: "software", name: "Software" },
      {
        id: "arquitetura-de-computadores",
        name: "Arquitetura de Computadores",
      },
      { id: "redes", name: "Redes" },
      { id: "redes-de-computadores", name: "Redes de Computadores" },
    ],
  },
];

export const quizes: Quizes = generateQuizes(quizesData);
