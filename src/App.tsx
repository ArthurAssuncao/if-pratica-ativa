import { getUser, handleAuthCallback } from "@netlify/identity";
import StudySelectionPage from "components/StudySelectionPage";
import { Footer } from "components/ui/Footer";
import { Navbar } from "components/ui/Navbar";
import { SidebarProvider } from "context/SidebarProvider";
import netlifyIdentity from "netlify-identity-widget";
import { useEffect } from "react";
import { isLocalhost } from "util/localhost";
import "./App.css";

if (typeof window !== "undefined") {
  localStorage.setItem(
    "netlifySiteURL",
    "https://if-pratica-ativa.netlify.app",
  );
  localStorage.clear();
  netlifyIdentity.init({
    APIUrl: isLocalhost ? "https://if-pratica-ativa.netlify.app" : undefined,
    locale: "pt-br",
  });
}

export default function App() {
  useEffect(() => {
    const initAuth = async () => {
      console.log("App.tsx - Iniciando verificação de autenticação");

      try {
        // 1. Processa o callback (Google -> Site)
        // É importante processar o callback PRIMEIRO
        const result = await handleAuthCallback();
        if (result) {
          console.log("Login via callback processado:", result.user?.email);
          window.history.replaceState(null, "", window.location.pathname);
        }

        // 2. Busca o usuário atual (Sessão persistente)
        const user = await getUser();
        if (user) {
          console.log("Usuário autenticado encontrado:", user.email);
        } else {
          console.log("Nenhum usuário logado.");
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        // O erro de redirect que você viu costuma ser lançado aqui
        if (err?.message?.includes("Redirecting")) {
          console.log("Redirecionamento em curso (comportamento esperado)");
        } else {
          console.error("Erro real na autenticação:", err);
        }
      }
    };

    initAuth();
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-blue-50 dark:bg-slate-950 transition-colors">
        <header>
          <Navbar />
        </header>
        <div className="flex items-start justify-center">
          <StudySelectionPage />
        </div>
        <Footer />
      </div>
    </SidebarProvider>
  );
}
