# Fundamentos de Python: Do Zero ao `if`

Bem-vindo à sua jornada na programação com **Python**! Esta linguagem é conhecida por sua sintaxe limpa, que se aproxima muito da leitura de um texto em inglês.

## 1. Variáveis e Tipos de Dados

Variáveis são como "caixas" onde guardamos informações. Em Python, você não precisa dizer o tipo da variável, ele descobre sozinho (tipagem dinâmica).

```python
nome = "João"          # String (texto)
idade = 18             # Int (número inteiro)
altura = 1.75          # Float (número decimal)
estudante = True       # Boolean (verdadeiro ou falso)
```

## 2. Entrada e Saída de Dados

Para interagir com o usuário, usamos o `print()` para exibir algo e o `input()` para ler o que o usuário digita.

```python
nome = input("Qual o seu nome? ")
print(f"Olá {nome}, seja bem-vindo ao IF Sudeste MG!")
```

> **Nota:** Todo dado que vem do `input()` chega como texto. Se precisar de um número, você deve converter: `idade = int(input("Sua idade: "))`.

## 3. Operadores Matemáticos

Python funciona como uma calculadora potente:

- `+` Soma
- `-` Subtração
- `*` Multiplicação
- `/` Divisão (resultado decimal)
- `//` Divisão Inteira (descarta o que vem após a vírgula)
- `%` Resto da divisão (Módulo)

## 4. Estruturas de Decisão (`if`, `elif`, `else`)

O `if` permite que o programa tome decisões baseadas em condições. Aqui, a **indentação** (o espaço no início da linha) é obrigatória e fundamental.

### Operadores de Comparação:

- `==` Igual a
- `!=` Diferente de
- `>` Maior que
- `<` Menor que
- `>=` Maior ou igual
- `<=` Menor ou igual

### Exemplo Prático: Sistema de Notas

Imagine que precisamos saber se um aluno foi aprovado:

```python
nota = float(input("Digite a nota final: "))

if nota >= 60:
    print("Parabéns! Você foi aprovado.")
elif nota >= 40:
    print("Você está de recuperação.")
else:
    print("Infelizmente você foi reprovado.")
```

## Exercício de Fixação

Tente escrever um código que leia um número e diga se ele é **Par** ou **Ímpar**.
_Dica: use o operador de resto da divisão `% 2`._
