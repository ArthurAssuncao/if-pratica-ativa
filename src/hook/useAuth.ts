import { USER_MOCKED } from "data/mock";
import netlifyIdentity from "netlify-identity-widget";
import { useEffect, useState } from "react";
import type { UserData } from "types/user";
import { isLocalhost } from "util/localhost";

export function useAuth() {
  // 1. Resolvemos o erro de Lint calculando o estado inicial FORA do useEffect
  // O React permite passar uma função para o useState para inicialização lógica
  const [user, setUser] = useState<UserData | null>(() => {
    if (isLocalhost) return USER_MOCKED as unknown as UserData;

    // Tenta pegar o usuário já logado antes da montagem
    const currentUser = netlifyIdentity.currentUser();
    return currentUser ? (currentUser as unknown as UserData) : null;
  });

  useEffect(() => {
    if (isLocalhost) return;

    netlifyIdentity.init();

    const handleLogin = (user: UserData) => {
      if (!user) return;
      setUser(user);
    };

    const handleLogout = () => setUser(null);

    // 2. Resolvemos o erro de tipagem fazendo um cast para 'any' no nome do evento
    // ou apenas omitindo o 'init' se já pegamos o currentUser acima.
    netlifyIdentity.on("init", (user) => user && handleLogin(user));
    netlifyIdentity.on("login", handleLogin);
    netlifyIdentity.on("logout", handleLogout);

    return () => {
      netlifyIdentity.on("init", (user) => user && handleLogin(user));
      netlifyIdentity.off("login", handleLogin);
      netlifyIdentity.off("logout", handleLogout);
    };
  }, []);

  return user;
}
