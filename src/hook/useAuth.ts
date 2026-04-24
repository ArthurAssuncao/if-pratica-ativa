import type { User } from "@netlify/identity";
import { getUser, onAuthChange } from "@netlify/identity";
import { useEffect, useState } from "react";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    getUser().then(setUser);
    return onAuthChange((_event, user) => setUser(user));
  }, []);

  return user;
}
