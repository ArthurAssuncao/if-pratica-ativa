import { Laptop, Menu } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

interface NavbarProps {
  onOpenMenu: () => void;
}

export const Navbar = ({ onOpenMenu }: NavbarProps) => {
  return (
    <nav className="w-full h-16 border-b  bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-600 flex items-center justify-between px-6 sticky top-0 z-50 transition-colors duration-300">
      {/* Lado Esquerdo: Logo e Nome */}
      <div className="flex items-center gap-3">
        <div className="bg-linear-to-br from-blue-600 to-indigo-700 p-2 rounded-lg">
          <Laptop className="text-white" size={20} />
        </div>
        <span className="text-xl font-bold tracking-tight text-blue-600 dark:text-white">
          IF{" "}
          <span className="bg-clip-text text-transparent bg-linear-to-br from-blue-600 to-indigo-700">
            Prática Ativa
          </span>
        </span>
      </div>

      {/* Lado Direito: Botão de Tema */}
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <button
          onClick={onOpenMenu}
          className="visible md:hidden group p-2 rounded-full border border-slate-700 hover:bg-slate-500 transition-all text-slate-700 hover:text-slate-200 dark:text-slate-300 dark:hover:text-slate-700 hover:cursor-pointer dark:hover:bg-slate-300 ease-in-out duration-500"
          title="Abrir Menu"
        >
          <Menu size={24} />
        </button>
      </div>
    </nav>
  );
};
