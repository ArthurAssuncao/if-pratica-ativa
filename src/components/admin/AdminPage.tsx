// pages/admin/index.tsx ou App.tsx
import { useEffect, useState } from "react";
import { AuthModalAdmin } from "../../auth/AuthModalAdmin";
import { adminAuth } from "../../service/adminAuth";
import { Spinner } from "../ui/Spinner";
import { AdminDashboard } from "./AdminDashboard";

export function AdminPage() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [, setUser] = useState(null);

  useEffect(() => {
    // Verifica autenticação ao carregar a página
    const checkAuth = async () => {
      console.log("Verificando autenticação...");

      // 1. Verifica se tem token
      const token = adminAuth.getToken();
      console.log("Token existe?", !!token);

      if (!token) {
        console.log("Sem token, não autenticado");
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      // 2. Verifica se token é válido
      const isValid = await adminAuth.verifyToken();
      console.log("Token válido?", isValid);

      if (isValid) {
        const userData = adminAuth.getUser();
        console.log("Usuário carregado:", userData);
        setUser(userData);
        console.log("Usuário carregado:", userData);
        setIsAuthenticated(true);
      } else {
        console.log("Token inválido, limpando...");
        adminAuth.logout();
        setIsAuthenticated(false);
      }

      setIsLoading(false);
    };

    checkAuth();
  }, []); // Executa apenas uma vez ao montar

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    // Carregar dados do admin, redirecionar, etc.
    console.log("Admin autenticado com sucesso!");
  };

  if (isLoading) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <AuthModalAdmin
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        title="Área Restrita - Administradores"
      />
    );
  }

  return <AdminDashboard />;
}
