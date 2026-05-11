import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  FileCode2,
  GitBranch,
  PlayCircle,
  Search,
  Split,
  Terminal,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Footer } from "./components/ui/Footer";
import { InstitutionalNotice } from "./components/ui/InstitutionalNotice";
import { default as IMG_CLICK_ERROR } from "/assets/img/exemplo-tipos-questao/encontre-erro.png";
import { default as IMG_FLOWCHART } from "/assets/img/exemplo-tipos-questao/fluxograma.png";
import { default as IMG_MULTIPLE_CHOICE } from "/assets/img/exemplo-tipos-questao/multipla-escolha.png";
import { default as IMG_REARRANGE } from "/assets/img/exemplo-tipos-questao/ordenacao-linhas.png";
import { default as IMG_FILL } from "/assets/img/exemplo-tipos-questao/preencher-lacuna.png";
import { default as IMG_OUTPUT } from "/assets/img/exemplo-tipos-questao/saida-codigo.png";
import { default as IMG_DESK_CHECK } from "/assets/img/exemplo-tipos-questao/teste-mesa.png";
import { default as IMG_TRUE_FALSE } from "/assets/img/exemplo-tipos-questao/verdadeiro-ou-falso.png";

const ExemploImage = ({ src, alt }: { src: string; alt: string }) => (
  <div className="relative group w-full max-w-4xl mx-auto ">
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

export const Home = () => {
  const secoes = [
    {
      titulo: "Múltipla Escolha",
      desc: "Avalie conceitos teóricos e sintaxe com alternativas inteligentes. O feedback imediato ajuda a corrigir o raciocínio na hora.",
      icon: <CheckCircle2 size={40} />,
      img: IMG_MULTIPLE_CHOICE,
      bgColor: "bg-blue-600",
    },
    {
      titulo: "Verdadeiro ou Falso",
      desc: "Ideal para validação rápida de definições e lógica. Uma forma eficiente de checar a compreensão de regras e conceitos.",
      icon: <Split size={40} />,
      img: IMG_TRUE_FALSE,
      bgColor: "bg-emerald-600",
    },
    {
      titulo: "Preencher Lacuna",
      desc: "Trabalhe a memorização ativa de termos-chave, fórmulas ou sintaxe. Complete o que falta para tornar o conteúdo funcional.",
      icon: <FileCode2 size={40} />,
      img: IMG_FILL,
      bgColor: "bg-slate-900",
    },
    {
      titulo: "Predição de Saída",
      desc: "Desenvolva a capacidade de prever resultados. Analise o cenário dado e determine exatamente o que será o desfecho final.",
      icon: <Terminal size={40} />,
      img: IMG_OUTPUT,
      bgColor: "bg-purple-700",
    },
    {
      titulo: "Encontrar o Erro",
      desc: "Onde está a falha? Identifique erros de lógica ou sintaxe em cenários preparados para desafiar seu olhar crítico.",
      icon: <Search size={40} />,
      img: IMG_CLICK_ERROR,
      bgColor: "bg-rose-600",
    },
    {
      titulo: "Ordenação de Linhas",
      desc: "Organize as linhas de uma tabela de forma que a informação seja apresentada de forma clara e coerente.",
      icon: <ArrowUpRight size={40} />,
      img: IMG_REARRANGE,
      bgColor: "bg-green-600",
    },
    {
      titulo: "Teste de Mesa",
      desc: "Verifique se uma resposta está correta, se um cálculo está correto ou se um resultado está dentro do intervalo esperado.",
      icon: <PlayCircle size={40} />,
      img: IMG_DESK_CHECK,
      bgColor: "bg-blue-600",
    },
    {
      titulo: "Fluxograma",
      desc: "Visualize o fluxo de um programa ou algoritmo, identificando as etapas e as condições necessárias para que o programa funcione corretamente.",
      icon: <GitBranch size={40} />,
      img: IMG_FLOWCHART,
      bgColor: "bg-green-600",
    },
    // ... adicione as demais seções seguindo o mesmo padrão
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
            className={`min-h-[96vh] flex items-start md:items-center py-10 px-6 ${secao.bgColor} text-white sticky top-0`}
          >
            <div className="container mx-auto">
              <div className="grid lg:grid-cols-1 gap-4 text-center">
                <div className="max-w-4xl mx-auto flex flex-col gap-8 md:gap-2 items-center">
                  <div className="flex items-center justify-center gap-6 md:gap-2 flex-col md:flex-row">
                    <div className="inline-flex p-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20  animate-pulse">
                      {secao.icon}
                    </div>
                    <h2 className="text-5xl md:text-5xl font-black tracking-tight">
                      {secao.titulo}
                    </h2>
                  </div>
                  <p className="text-xl md:text-xl opacity-90 leading-relaxed">
                    {secao.desc}
                  </p>
                </div>

                <ExemploImage src={secao.img} alt={secao.titulo} />

                <div className="pt-6 md:pt-2">
                  <Link
                    to="/app"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-900 rounded-2xl font-black hover:scale-105 transition-all shadow-xl"
                  >
                    Testar Agora <PlayCircle />
                  </Link>
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
