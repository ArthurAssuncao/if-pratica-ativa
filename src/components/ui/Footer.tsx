import { Award, GraduationCap, MapPin } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-linear-to-br from-blue-700 via-blue-800 to-indigo-900 text-white py-12 px-6 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-center border-b border-white/10 pb-10">
          {/* Lado Esquerdo: Identidade do IF */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm border border-white/20">
              <GraduationCap size={32} className="text-blue-200" />
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-lg font-bold tracking-tight">
                IF Sudeste MG
              </h3>
              <p className="text-blue-200/80 text-sm font-medium">
                Campus Santos Dumont
              </p>
            </div>
          </div>

          {/* Centro: Destaque ao Professor */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
              <Award size={16} className="text-yellow-400" />
              <span className="text-xs uppercase tracking-[0.2em] font-bold text-blue-100">
                Orientação
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-white via-blue-100 to-blue-200">
              Prof. Arthur Assunção
            </h2>
            <div className="h-1 w-12 bg-blue-400 rounded-full" />
          </div>

          {/* Lado Direito: Localização e Contexto */}
          <div className="flex flex-col items-center md:items-end gap-2 text-blue-100/90">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Santos Dumont - MG</span>
              <MapPin size={16} className="text-blue-300" />
            </div>
            <p className="text-xs text-blue-200/60 text-center md:text-right leading-relaxed">
              Desenvolvimento de Tecnologias Educacionais
              <br />
              Instituto Federal do Sudeste de Minas Gerais
            </p>
          </div>
        </div>

        {/* Linha Inferior: Copyright e Versão */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-8 gap-4 text-blue-300/60">
          <p className="text-xs font-medium">
            © {currentYear} — Sistema de Quiz Acadêmico
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] uppercase tracking-widest font-bold">
                Produção Acadêmica
              </span>
            </div>
            <span className="text-[10px] bg-white/5 px-2 py-1 rounded border border-white/10">
              v1.0.0
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
