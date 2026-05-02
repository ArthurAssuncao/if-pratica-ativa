import { USER_MOCKED } from "data/mock";
import netlifyIdentity from "netlify-identity-widget";
import { useEffect, useState } from "react";
import { StudyService } from "service/study-service";
import { mapUserToDatabase, type UserData } from "types/user";
import { isLocalhost } from "util/localhost";

// Variável fora do hook para persistir MESMO com re-renders e StrictMode
let lastSyncedUserId: string | null = null;
let isSyncing = false;

export function useAuth() {
  const [user, setUser] = useState<UserData | null>(() => {
    if (isLocalhost) return USER_MOCKED as unknown as UserData;
    return netlifyIdentity.currentUser() as unknown as UserData | null;
  });

  useEffect(() => {
    if (!isLocalhost) netlifyIdentity.init();

    const syncUser = async (userData: UserData) => {
      // 1. Bloqueio por ID e Status: Se já sincronizamos ESSE usuário, ou se já tem um fetch voando, para aqui.
      if (lastSyncedUserId === userData.id || isSyncing) return;

      isSyncing = true;
      try {
        const userDb = mapUserToDatabase(userData);
        await StudyService.syncProfile(userDb);

        // Só marca como sincronizado DEPOIS do sucesso do banco
        lastSyncedUserId = userData.id;
        console.log("✅ Perfil sincronizado única vez para:", userData.email);
      } catch (error) {
        console.error("❌ Erro na sincronização:", error);
      } finally {
        isSyncing = false;
      }
    };

    // Tenta sincronizar o usuário inicial
    if (user) syncUser(user);

    const handleLogin = (loggedUser: UserData) => {
      if (!loggedUser) return;
      setUser(loggedUser);
      syncUser(loggedUser);
    };

    const handleLogout = () => {
      setUser(null);
      lastSyncedUserId = null; // Reseta para permitir novo login
    };

    netlifyIdentity.on("login", handleLogin);
    netlifyIdentity.on("logout", handleLogout);

    return () => {
      netlifyIdentity.off("login", handleLogin);
      netlifyIdentity.off("logout", handleLogout);
    };
  }, [user, user?.id]); // Observa apenas o ID do usuário

  return { user, isLoggedIn: !!user, setUser };
}
