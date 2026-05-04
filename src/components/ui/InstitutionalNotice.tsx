import { ChevronDown, ChevronUp, ExternalLink, Info } from "lucide-react";
import { useState } from "react";

export const InstitutionalNotice = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section
      className={`w-full bg-amber-50 dark:bg-amber-950/20 border-b border-amber-200 dark:border-amber-900 transition-all duration-300 ease-in-out ${
        isExpanded ? "py-6" : "py-2"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Barra Curta / Header do Componente */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200 text-sm font-medium">
            <Info size={16} className="shrink-0" />
            <span className="hidden sm:inline">
              Este é um domínio independente para projetos acadêmicos.
            </span>
            <span className="sm:hidden">Domínio acadêmico independente.</span>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-100 hover:underline transition-all hover:cursor-pointer"
          >
            {isExpanded ? (
              <>
                Ocultar <ChevronUp size={14} />
              </>
            ) : (
              <>
                Saiba mais <ChevronDown size={14} />
              </>
            )}
          </button>
        </div>

        {/* Conteúdo Expandido */}
        {isExpanded && (
          <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="prose prose-sm prose-amber dark:prose-invert max-w-none">
              <h4 className="text-amber-900 dark:text-amber-100 font-bold mb-2">
                Sobre este domínio (ifsudestemg.dev)
              </h4>
              <p className="text-amber-800/90 dark:text-amber-200/80 leading-relaxed">
                Este portal é uma iniciativa acadêmica independente destinada à
                hospedagem e divulgação de projetos de{" "}
                <strong>ensino, pesquisa e extensão</strong> desenvolvidos por
                servidores do IF Sudeste MG.
              </p>
              <p className="text-amber-800/90 dark:text-amber-200/80 leading-relaxed mt-2">
                Ressaltamos que, embora o conteúdo aqui presente seja de caráter
                técnico-científico e vinculado às atividades docentes,{" "}
                <strong>
                  este domínio não é um canal oficial da instituição{" "}
                </strong>
                e não possui vínculo com a administração central ou órgãos de TI
                do IF Sudeste MG.
              </p>

              <div className="mt-4 flex flex-wrap gap-4 items-center border-t border-amber-200 dark:border-amber-900 pt-4">
                <a
                  href="https://www.ifsudestemg.edu.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-amber-900 dark:text-amber-100 font-bold hover:text-amber-700 transition-colors hover:cursor-pointer"
                >
                  Acessar Portal Oficial (edu.br) <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
