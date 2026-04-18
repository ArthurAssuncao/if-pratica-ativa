import Markdown from "react-markdown";
import { SyntaxHighlighterCustom } from "./SyntaxHighlighterCustom";

export function MarkdownSyntax({ children }: { children: string }) {
  return (
    <Markdown
      components={{
        // Renderiza o h2 (Título 2) mas permite código dentro dele
        h2: ({ children }) => (
          <h2 className="text-2xl font-bold mb-8 text-gray-700 dark:text-slate-200">
            {children}
          </h2>
        ),
        // O componente de código que será usado dentro do título ou em blocos
        code(props) {
          const { children, className } = props;
          const match = /language-(\w+)/.exec(className || "");

          return match ? (
            // Se for um bloco de código completo dentro do título
            <SyntaxHighlighterCustom language={match[1]}>
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighterCustom>
          ) : (
            // Se for código inline (ex: `print()`) dentro da frase do título
            <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono text-[0.9em] font-semibold text-blue-600 dark:text-blue-400">
              {children}
            </code>
          );
        },
      }}
    >
      {children}
    </Markdown>
  );
}
