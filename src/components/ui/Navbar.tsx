import { useSidebar } from "@hook/useSidebar";
import AuthModal from "auth/AuthModal";
import { useAuth } from "hook/useAuth";
import { useBreakpoints } from "hook/useBreakpoints";
import { Laptop, LogIn, Menu } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

export const Navbar = () => {
  const { toggleSidebar } = useSidebar();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const isTablet = useBreakpoints().isTablet;

  const user = useAuth();

  const handleLoginSuccess = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <nav className=" w-full h-16 shadow-md bg-blue-700   flex items-center justify-between px-6 fixed top-0 z-50 transition-colors duration-300">
      {/* Lado Esquerdo: Logo e Nome */}
      <div className="flex items-center gap-3">
        <div className="bg-white p-2 rounded-lg">
          <Laptop className="text-blue-700" size={20} />
        </div>
        <span className="text-xl font-bold tracking-tight text-blue-600 dark:text-white">
          <span className="text-white">IF Prática Ativa</span>
        </span>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle className="hidden md:block" />

        {!user ? (
          <>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full text-sm font-semibold transition-all border border-white/20 active:scale-95"
            >
              <LogIn size={18} />
              <span className="hidden sm:inline">Entrar</span>
            </button>
            <button
              onClick={() => toggleSidebar()}
              className={`visible lg:hidden group p-2 rounded-full border border-slate-700 bg-slate-50 hover:bg-slate-500 transition-all text-slate-700 hover:text-slate-200 dark:text-slate-300 dark:hover:text-slate-700 hover:cursor-pointer dark:hover:bg-slate-300 ease-in-out duration-500 `}
              title="Abrir Menu"
            >
              <Menu size={24} />
            </button>
          </>
        ) : (
          <button
            className={`flex items-center gap-2 text-white bg-blue-800 px-3 lg:px-4 py-1.5 h-11 rounded-full border border-blue-400/30 ${!isTablet ? "cursor-default" : "cursor-pointer"}`}
            onClick={() => isTablet && toggleSidebar()}
          >
            <img
              src={user.user_metadata?.avatar_url || ""}
              alt="avatar"
              className="w-8 h-8 rounded-full lg:hidden"
            />
            <span className="text-sm font-medium">
              {user.user_metadata?.full_name || "Aluno"}
            </span>
            <Menu size={24} className="block lg:hidden" />
          </button>
        )}
      </div>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </nav>
  );
};
