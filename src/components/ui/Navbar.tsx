import { Laptop, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export const Navbar = () => {
  const [tema, setTema] = useState<"light" | "dark">("dark");

  // Lógica para alternar o tema no HTML/Body
  useEffect(() => {
    const root = window.document.documentElement;
    if (tema === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [tema]);

  const alternarTema = () => {
    setTema(tema === "light" ? "dark" : "light");
  };

  return (
    <nav className="w-full h-16 border-b  bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-600 flex items-center justify-between px-6 sticky top-0 z-50 transition-colors duration-300">
      {/* Lado Esquerdo: Logo e Nome */}
      <div className="flex items-center gap-3">
        <div className="bg-green-600 p-2 rounded-lg">
          <Laptop className="text-white" size={20} />
        </div>
        <span className="text-xl font-bold tracking-tight text-green-600 dark:text-white">
          IF <span className="text-green-600">Prática Ativa</span>
        </span>
      </div>

      {/* Lado Direito: Botão de Tema */}
      <button
        onClick={alternarTema}
        className="group p-2 rounded-full border border-slate-700 hover:bg-slate-800 transition-all text-slate-300 hover:cursor-pointer dark:hover:bg-white ease-in-out duration-500"
        title={tema === "light" ? "Ativar Modo Escuro" : "Ativar Modo Claro"}
      >
        {tema === "light" ? (
          <Moon
            size={20}
            className="text-black group-hover:text-white transition-all ease-in-out duration-500"
          />
        ) : (
          <Sun
            size={20}
            className="text-yellow-200 group-hover:text-yellow-800 transition-all ease-in-out duration-500"
          />
        )}
      </button>
    </nav>
  );
};
