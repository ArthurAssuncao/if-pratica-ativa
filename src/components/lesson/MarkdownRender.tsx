import type { Element } from "hast";
import ReactMarkdown, { type Components } from "react-markdown";

import { SyntaxHighlighterCustom } from "components/ui/SyntaxHighlighterCustom";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  children: string;
}

/**
 * Interface para as propriedades do componente 'code' injetadas pelo react-markdown.
 * Estendemos os atributos nativos do HTML <code> e incluímos as props específicas do parser.
 */
interface CodeComponentProps extends React.ComponentPropsWithoutRef<"code"> {
  node?: Element;
  inline?: boolean;
}

/**
 * Componente para renderizar Markdown com suporte a Syntax Highlighting
 * usando Tailwind Typography (prose) e um componente de destaque customizado.
 */
export default function MarkdownRenderer({ children }: MarkdownRendererProps) {
  const components: Components = {
    /**
     * Personalizamos a renderização da tag 'code' para distinguir
     * entre blocos de código (fenced code blocks) e código inline.
     */
    code({ inline, className, children, ...props }: CodeComponentProps) {
      const match = /language-(\w+)/.exec(className || "");
      const { style, ...restProps } = props;

      // Verifica se é um bloco de código (com linguagem definida) ou código inline
      return !inline && match ? (
        <div className="relative  rounded-lg border border-slate-300 dark:border-slate-800 shadow-md">
          {/* Badge da linguagem no topo do bloco de código */}
          <div className="flex justify-between items-center px-4 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-400 text-xs font-mono">
            <span>{match[1]}</span>
          </div>

          <SyntaxHighlighterCustom
            language={match[1]}
            PreTag="div"
            customStyle={{
              margin: 0,
              fontSize: "0.875rem",
              padding: "8px",
              ...style,
            }}
            {...restProps}
          >
            {String(children).replace(/\n$/, "")}
          </SyntaxHighlighterCustom>
        </div>
      ) : (
        <code
          className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-pink-500 font-mono text-sm"
          {...props}
        >
          {children}
        </code>
      );
    },
  };

  return (
    <article className="prose prose-slate dark:prose-invert max-w-full">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </ReactMarkdown>
    </article>
  );
}
