import { QuizData, Quizes } from "types/quiz";

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
        resposta_correta: "list (lista)",
        nivel: "iniciante",
      },
      {
        id: 2,
        tipo: "verdadeiro_falso",
        pergunta: "Em Python, a indentação é opcional.",
        opcoes: ["Verdadeiro", "Falso"],
        resposta_correta: "Falso",
        nivel: "iniciante",
      },
      {
        id: 3,
        tipo: "lacuna",
        pergunta: "Complete o código para iterar de 0 a 4:",
        codigo: "for i in _______(5):\n    print(i)",

        resposta_correta: "range",
        nivel: "iniciante",
      },
      {
        id: 4,
        tipo: "predicao",
        pergunta: "Qual será a saída deste código?",
        codigo: "x = 10\ny = 5\nprint(x // y)",
        resposta_correta: "2",
        nivel: "iniciante",
      },
      {
        id: 5,
        tipo: "ordenacao",
        pergunta: "Ordena as linhas para criar um loop que imprime de 0 a 2:",
        linhas: [
          { texto: "print(i)", identationLevel: 1 },
          { texto: "for i in range(3):", identationLevel: 0 },
        ],
        resposta_correta: "for i in range(3):\nprint(i)",
        nivel: "iniciante",
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
        indexErro: 0,
        resposta_correta: "0",
        nivel: "iniciante",
      },
      {
        id: 7,
        tipo: "fluxograma",
        pergunta: "Se o usuário digitar 18, para qual ramo o código irá?",
        codigo: "idade = int(input('Idade: '))",
        condicao: "if idade >= 18:",
        ramos: [
          { id: "a", label: "True (Entra no IF)", correta: true },
          { id: "b", label: "False (Pula o IF)", correta: false },
        ],
        resposta_correta: "True (Entra no IF)",
        nivel: "iniciante",
      },
      {
        id: 11,
        tipo: "fluxograma_novo",
        nivel: "iniciante",
        pergunta:
          "Se o usuário digitar o valor 20, qual será o destino do fluxo?",
        codigo: "idade = int(input('Digite sua idade: '))",
        condicao: "if idade >= 18:",
        ramos: [
          {
            id: "ramo_c",
            label: "True (Entra no bloco)",
            correta: true,
          },
        ],
        resposta_correta: "True (Entra no bloco)",
        explicacao:
          "Como 20 é maior ou igual a 18, a condição do IF é verdadeira.",
      },
      {
        id: 8,
        tipo: "fluxograma_novo",
        nivel: "iniciante",
        pergunta:
          "Se o usuário digitar o valor 20, qual será o destino do fluxo?",
        codigo: "idade = int(input('Digite sua idade: '))",
        condicao: "if idade >= 18:",
        ramos: [
          {
            id: "ramo_a",
            label: "True (Entra no bloco)",
            correta: true,
          },
          {
            id: "ramo_b",
            label: "False (Pula o bloco)",
            correta: false,
          },
        ],
        resposta_correta: "True (Entra no bloco)",
        explicacao:
          "Como 20 é maior ou igual a 18, a condição do IF é verdadeira.",
      },
      {
        id: 9,
        tipo: "fluxograma_novo",
        nivel: "intermediário",
        pergunta:
          "Para uma nota igual a 7.5, qual caminho o algoritmo seguirá?",
        codigo: "nota = 7.5",
        condicao: "if nota >= 9.0:",
        ramos: [
          {
            id: "r1",
            label: "Excelente (IF)",
            correta: false,
          },
          {
            id: "r2",
            label: "Bom (ELIF nota >= 7)",
            correta: true,
          },
          {
            id: "r3",
            label: "Recuperação (ELSE)",
            correta: false,
          },
        ],
        resposta_correta: "Bom (ELIF nota >= 7)",
        explicacao:
          "A primeira condição falha (7.5 < 9), mas a segunda (ELIF) é verdadeira.",
      },
      {
        id: 12,
        tipo: "fluxograma_novo",
        nivel: "intermediário",
        pergunta:
          "Para uma nota igual a 7.5, qual caminho o algoritmo seguirá?",
        codigo: "nota = 7.5",
        condicao: "if nota >= 9.0:",
        ramos: [
          {
            id: "r1",
            label: "Excelente (IF)",
            correta: false,
          },
          {
            id: "r2",
            label: "Bom (ELIF nota >= 7)",
            correta: true,
          },
          {
            id: "r3",
            label: "Recuperação (ELSE)",
            correta: false,
          },
          {
            id: "r4",
            label: "Não sei 1",
            correta: false,
          },
        ],
        resposta_correta: "Bom (ELIF nota >= 7)",
        explicacao:
          "A primeira condição falha (7.5 < 9), mas a segunda (ELIF) é verdadeira.",
      },
      {
        id: 13,
        tipo: "fluxograma_novo",
        nivel: "intermediário",
        pergunta:
          "Para uma nota igual a 7.5, qual caminho o algoritmo seguirá?",
        codigo: "nota = 7.5",
        condicao: "if nota >= 9.0:",
        ramos: [
          {
            id: "r1",
            label: "Excelente (IF)",
            correta: false,
          },
          {
            id: "r2",
            label: "Bom (ELIF nota >= 7)",
            correta: true,
          },
          {
            id: "r3",
            label: "Recuperação (ELSE)",
            correta: false,
          },
          {
            id: "r4",
            label: "Não sei 1",
            correta: false,
          },
          {
            id: "r5",
            label: "Não sei 2",
            correta: false,
          },
        ],
        resposta_correta: "Bom (ELIF nota >= 7)",
        explicacao:
          "A primeira condição falha (7.5 < 9), mas a segunda (ELIF) é verdadeira.",
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

export const quizes: Quizes = generateQuizes(quizesData);
