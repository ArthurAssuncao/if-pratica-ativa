// service/contentService.ts
import type { Content } from "../types/study";

interface CreateContentData {
  id?: string;
  name?: string;
  slug?: string;
  disciplineId?: string;
  level?: string;
  order?: number;
}

class ContentService {
  private apiUrl = "/.netlify/functions/admin-create-content";

  async createContent(data: CreateContentData): Promise<Content> {
    const token =
      localStorage.getItem("admin_token") ||
      sessionStorage.getItem("admin_token");

    if (!token) {
      throw new Error("Usuário não autenticado");
    }

    const response = await fetch(this.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Erro ao cadastrar conteúdo");
    }

    return result.data;
  }
}

export const contentService = new ContentService();
