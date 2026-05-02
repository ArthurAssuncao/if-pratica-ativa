import netlifyIdentity from "netlify-identity-widget";
import type { UserDatabase } from "./database";

export type UserData = netlifyIdentity.User;

export interface UserProfile {
  id: string; // UUID vindo do provider
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProgress {
  questionId: number; // FK para questions.id (Integer)
  disciplineSlug: string;
  attempts: number;
  isCorrect: boolean;
  solvedAt: Date | null;
  lastAttemptAt: Date;
}

export const mapUserToDatabase = (user: UserData): UserDatabase => {
  return {
    id: user.id,
    email: user.email,
    full_name: user?.user_metadata?.full_name || "",
    avatar_url: user?.user_metadata?.avatar_url || "",
  };
};
