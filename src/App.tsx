import { getUser, handleAuthCallback } from "@netlify/identity";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import StudySelectionPage from "components/StudySelectionPage";
import { Footer } from "components/ui/Footer";
import { Navbar } from "components/ui/Navbar";
import { SidebarProvider } from "context/SidebarProvider";
import netlifyIdentity from "netlify-identity-widget";
import { useEffect, useState } from "react";
import { isLocalhost } from "util/localhost";
import "./App.css";
import MarkdownRenderer from "./components/lesson/MarkdownRender";
import { FeedbackFloatingButton } from "./components/ui/FeedbackFloatingButton";
import { InstitutionalNotice } from "./components/ui/InstitutionalNotice";
import { Modal } from "./components/ui/Modal";
import { CookieConsent } from "./legal/CookieConsent";
import markdownPrivacy from "./legal/privacy.md?raw";

if (typeof window !== "undefined") {
  localStorage.setItem(
    "netlifySiteURL",
    "https://if-pratica-ativa.netlify.app",
  );
  netlifyIdentity.init({
    APIUrl: isLocalhost ? "https://if-pratica-ativa.netlify.app" : undefined,
    locale: "pt-br",
  });
}

const queryClient = new QueryClient();

export default function App() {
  const [isModalPrivacyOpen, setIsModalPrivacyOpen] = useState(false);

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
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <div className="min-h-screen bg-blue-50 dark:bg-slate-950 transition-colors">
          <header className="mb-16">
            <Navbar />
          </header>
          <div className="flex items-start justify-center">
            <StudySelectionPage />
          </div>
          <Footer />
          <InstitutionalNotice />
          <FeedbackFloatingButton />
        </div>
      </SidebarProvider>
      <CookieConsent onPrivacyClick={() => setIsModalPrivacyOpen(true)} />
      <Modal
        isOpen={isModalPrivacyOpen}
        onClose={() => setIsModalPrivacyOpen(false)}
      >
        <MarkdownRenderer>{markdownPrivacy}</MarkdownRenderer>
      </Modal>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
