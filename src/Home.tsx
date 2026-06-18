import {
  ArrowRight,
  ArrowUpAZ,
  CheckCheck,
  CheckCircle2,
  GitBranch,
  PlayCircle,
  RectangleEllipsis,
  RedoDot,
  Search,
  Split,
  Terminal,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Footer } from "./components/ui/Footer";
import { InstitutionalNotice } from "./components/ui/InstitutionalNotice";
import { useAuth } from "./hook/useAuth";
import { useIsMobile } from "./hook/useIsMobile";
import { default as IMG_CLICK_ERROR } from "/assets/img/exemplo-tipos-questao/mobile/encontre-erro.png";
import { default as IMG_FLOWCHART } from "/assets/img/exemplo-tipos-questao/mobile/fluxograma.png";
import { default as IMG_MULTIPLE_CHOICE } from "/assets/img/exemplo-tipos-questao/mobile/multipla-escolha.png";
import { default as IMG_REARRANGE } from "/assets/img/exemplo-tipos-questao/mobile/ordenacao-linhas.png";
import { default as IMG_FILL } from "/assets/img/exemplo-tipos-questao/mobile/preencher-lacuna.png";
import { default as IMG_OUTPUT } from "/assets/img/exemplo-tipos-questao/mobile/saida-codigo.png";
import { default as IMG_DESK_CHECK } from "/assets/img/exemplo-tipos-questao/mobile/teste-mesa.png";
import { default as IMG_TRUE_FALSE } from "/assets/img/exemplo-tipos-questao/mobile/verdadeiro-ou-falso.png";

const ExemploImage = ({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) => (
  <div className={`relative group w-full max-w-4xl mx-auto ${className}`}>
    {/* Efeito de brilho atrás da imagem */}
    <div className="absolute -inset-4 bg-white/10 rounded-[2.5rem] blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
    <div className="m-0 max-h-110 relative overflow-hidden ">
      <img
        src={src}
        alt={alt}
        className="m-0 mx-auto w-auto max-h-110 object-cover transition-transform border-2 hover:border-blue-400 rounded-3xl  border-slate-400"
      />
    </div>
  </div>
);

interface HomeSection {
  titulo: string;
  descricao: string;
  icon: React.ReactNode;
  img: string;
  bgColor: string;
  beneficios: string[];
}

const HOME_SECTION_ICON_SIZE_DESKTOP = 40;
const HOME_SECTION_ICON_SIZE_MOBILE = 32;

export const Home = () => {
  const isMobile = useIsMobile();
  const user = useAuth().user;
  const navigate = useNavigate();

  if (user) {
    console.log("Usuário já logado");
    // armazena no localStorage com nome de usuário e horário se não existir
    if (!localStorage.getItem("userLoginTime")) {
      console.log("Armazenando usuário logado");
      localStorage.setItem("userLoginTime", new Date().toISOString());
      window.history.replaceState(null, "", window.location.pathname + "#/app");
      navigate("/app");
    }
  }

  const secoes: HomeSection[] = [
    {
      titulo: "Múltipla Escolha",
      descricao:
        "Avalie conceitos teóricos e sintaxe com alternativas inteligentes. O feedback imediato ajuda a corrigir o raciocínio na hora.",
      icon: (
        <CheckCircle2
          size={
            isMobile
              ? HOME_SECTION_ICON_SIZE_MOBILE
              : HOME_SECTION_ICON_SIZE_DESKTOP
          }
        />
      ),
      img: IMG_MULTIPLE_CHOICE,
      bgColor: "bg-blue-600",
      beneficios: [
        "Identificação rápida de lacunas de conhecimento",
        "Estímulo ao processo de eliminação e lógica dedutiva",
        "Ideal para exames de certificação e concursos",
        "Feedback instantâneo para correção de conceitos equivocados",
      ],
    },
    {
      titulo: "Verdadeiro ou Falso",
      descricao:
        "Ideal para validação rápida de definições e lógica. Uma forma eficiente de checar a compreensão de regras e conceitos.",
      icon: (
        <Split
          size={
            isMobile
              ? HOME_SECTION_ICON_SIZE_MOBILE
              : HOME_SECTION_ICON_SIZE_DESKTOP
          }
        />
      ),
      img: IMG_TRUE_FALSE,
      bgColor: "bg-emerald-600",
      beneficios: [
        "Julgamento crítico de afirmações e premissas",
        "Alta agilidade na revisão de grandes volumes de conteúdo",
        "Diferenciação precisa entre conceitos semelhantes",
        "Treino focado em normas, leis e definições axiomáticas",
      ],
    },
    {
      titulo: "Preencher Lacuna",
      descricao:
        "Trabalhe a memorização ativa de termos-chave, fórmulas ou sintaxe. Complete o que falta para tornar o conteúdo funcional.",
      icon: (
        <RectangleEllipsis
          size={
            isMobile
              ? HOME_SECTION_ICON_SIZE_MOBILE
              : HOME_SECTION_ICON_SIZE_DESKTOP
          }
        />
      ),
      img: IMG_FILL,
      bgColor: "bg-slate-900",
      beneficios: [
        "Fortalecimento da memória semântica e vocabulário técnico",
        "Exigência de precisão na escrita de fórmulas ou termos",
        "Reconhecimento de padrões e estruturas sintáticas",
        "Engajamento superior à simples leitura passiva",
      ],
    },
    {
      titulo: "Predição de Saída",
      descricao:
        "Desenvolva a capacidade de prever resultados. Analise o cenário dado e determine exatamente o que será o desfecho final.",
      icon: (
        <Terminal
          size={
            isMobile
              ? HOME_SECTION_ICON_SIZE_MOBILE
              : HOME_SECTION_ICON_SIZE_DESKTOP
          }
        />
      ),
      img: IMG_OUTPUT,
      bgColor: "bg-purple-700",
      beneficios: [
        "Capacidade de simulação mental de processos",
        "Previsão de desfechos em sistemas complexos ou experimentos",
        "Análise de causa e efeito sem necessidade de execução real",
        "Foco total na interpretação de regras de transformação",
      ],
    },
    {
      titulo: "Encontrar o Erro",
      descricao:
        "Onde está a falha? Identifique erros de lógica ou sintaxe em cenários preparados para desafiar seu olhar crítico.",
      icon: (
        <Search
          size={
            isMobile
              ? HOME_SECTION_ICON_SIZE_MOBILE
              : HOME_SECTION_ICON_SIZE_DESKTOP
          }
        />
      ),
      img: IMG_CLICK_ERROR,
      bgColor: "bg-rose-600",
      beneficios: [
        "Desenvolvimento de atenção plena aos detalhes",
        "Habilidade de depuração (debugging) aplicada a qualquer contexto",
        "Revisão crítica de trabalhos e fluxos de trabalho",
        "Aprendizado através da análise de equívocos comuns",
      ],
    },
    {
      titulo: "Ordenação de Linhas",
      descricao:
        "Organize as linhas de uma tabela ou trechos de informação de forma que a informação seja apresentada de forma clara e coerente.",
      icon: (
        <ArrowUpAZ
          size={
            isMobile
              ? HOME_SECTION_ICON_SIZE_MOBILE
              : HOME_SECTION_ICON_SIZE_DESKTOP
          }
        />
      ),
      img: IMG_REARRANGE,
      bgColor: "bg-green-600",
      beneficios: [
        "Comprensão de sequenciamento lógico e cronológico",
        "Capacidade de organização de ideias e priorização",
        "Entendimento da hierarquia em processos estruturados",
        "Visualização da coesão e coerência em blocos de informação",
      ],
    },
    {
      titulo: "Teste de Mesa",
      descricao:
        "Verifique se uma resposta está correta, se um cálculo está correto ou se um resultado está dentro do intervalo esperado.",
      icon: (
        <RedoDot
          size={
            isMobile
              ? HOME_SECTION_ICON_SIZE_MOBILE
              : HOME_SECTION_ICON_SIZE_DESKTOP
          }
        />
      ),
      img: IMG_DESK_CHECK,
      bgColor: "bg-blue-600",
      beneficios: [
        "Rastreamento minucioso de mudanças de estado e variáveis",
        "Prevenção de erros acumulados em cálculos complexos",
        "Metodologia rigorosa para validação de hipóteses",
        "Domínio total sobre o fluxo de dados e transformações",
      ],
    },
    {
      titulo: "Fluxograma",
      descricao:
        "Visualize o fluxo de um processo ou algoritmo, identificando as etapas e as condições necessárias para um funcionamento correto.",
      icon: (
        <GitBranch
          size={
            isMobile
              ? HOME_SECTION_ICON_SIZE_MOBILE
              : HOME_SECTION_ICON_SIZE_DESKTOP
          }
        />
      ),
      img: IMG_FLOWCHART,
      bgColor: "bg-green-600",
      beneficios: [
        "Pensamento sistêmico e visão holística do problema",
        "Identificação de pontos de decisão e caminhos alternativos",
        "Documentação clara de processos de qualquer natureza",
        "Facilitação da comunicação de ideias complexas",
      ],
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-950 transition-colors duration-500">
      <InstitutionalNotice />
      {/* --- HERO SECTION TURBO --- */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-950">
        {/* Background Decorativo */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-250 h-150 bg-blue-500/20 blur-[120px] rounded-full pointer-events-none"></div>
        </div>

        <div className="container relative z-10 mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-full animate-bounce">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Novo: Suporte a testes de mesa interativos
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-none dark:text-white">
            Plataforma <br />
            <span className="bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-indigo-500">
              IF Aprenda
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-12 leading-relaxed">
            Sistema para fixação de conteúdo multidisciplinar. Pratique lógica,
            linguagens e conceitos técnicos em um só lugar.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              to="/app"
              className="group relative px-10 py-5 bg-blue-600 text-white rounded-2xl font-black text-xl hover:bg-blue-700 transition-all shadow-[0_20px_50px_rgba(37,99,235,0.3)] hover:-translate-y-1"
            >
              <span className="flex items-center gap-3">
                Entrar no Sistema{" "}
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <a
              href="#exercicios"
              className="text-slate-500 hover:text-slate-800 dark:hover:text-white font-bold transition-colors"
            >
              Ver tipos de questões
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-30">
          <div className="w-6 h-10 border-2 border-slate-400 rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-slate-400 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* --- SEÇÕES DE TIPO DE QUESTÃO (Full Screen) --- */}
      <div id="exercicios">
        {secoes.map((secao, index) => (
          <section
            key={index}
            className={`min-h-[96vh] flex items-start md:items-start p-7 md:pt-10 ${secao.bgColor} text-white sticky top-0`}
          >
            <div className="container mx-auto">
              <div className="flex flex-col gap-8 text-center">
                <div className="max-w-4xl mx-auto flex flex-col gap-8 md:gap-2 items-center">
                  <div className="flex items-center justify-center gap-6 md:gap-2 flex-row">
                    <div className="inline-flex p-1 md:p-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20  animate-pulse">
                      {secao.icon}
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight text-left">
                      {secao.titulo}
                    </h2>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                  <ExemploImage src={secao.img} alt={secao.titulo} />
                  <div className="flex flex-col gap-8 md:gap-4 lg:gap-8 items-start">
                    <p className=" md:text-xl  leading-relaxed text-justify md:text-left">
                      {secao.descricao}
                    </p>
                    <ul className="flex-col  gap-2 hidden md:flex">
                      {secao.beneficios.map((beneficio, index) => (
                        <li
                          key={index}
                          className="flex gap-2 items-center justify-start"
                        >
                          <div className="border-2 border-white rounded-full p-1">
                            <CheckCheck className="text-white" />
                          </div>
                          <span className="text-left">{beneficio}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="pt-0 md:pt-2 flex items-center justify-center w-full">
                      <Link
                        to="/app"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-900 rounded-2xl font-black hover:scale-105 transition-all shadow-xl"
                      >
                        Testar Agora <PlayCircle />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* --- FOOTER SIMPLES --- */}
      <Footer />
    </div>
  );
};
