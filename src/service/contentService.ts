// service/contentService.ts
import type { Content } from "../types/study";

interface UpdateContentData {
  name?: string;
  level?: string;
  order?: number;
  is_active?: boolean;
}

interface GetContentsParams {
  disciplineId?: string;
  level?: string;
  search?: string;
  limit?: number;
  offset?: number;
  orderBy?: "order" | "name" | "created_at" | "updated_at";
  orderDirection?: "ASC" | "DESC";
}

interface GetContentsResponse {
  success: boolean;
  data: Content[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
  };
  isAdmin?: boolean;
  disciplineId?: number;
}

class ContentService {
  private apiUrl = "/.netlify/functions/admin-content";

  private getFullUrl(path?: string): string {
    const base = typeof window !== "undefined" ? window.location.origin : "";
    return `${base}${this.apiUrl}${path || ""}`;
  }

  private getToken(): string | null {
    return (
      localStorage.getItem("admin_token") ||
      sessionStorage.getItem("admin_token")
    );
  }

  private getHeaders(): HeadersInit {
    const token = this.getToken();
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  /**
   * Busca todos os conteúdos com filtros opcionais
   */
  async getAllContents(
    params?: GetContentsParams,
  ): Promise<GetContentsResponse> {
    try {
      // Constroi a URL com os parâmetros
      const baseUrl = this.getFullUrl();
      const url = new URL(baseUrl);

      if (params) {
        if (params.disciplineId)
          url.searchParams.append(
            "disciplineId",
            params.disciplineId.toString(),
          );
        if (params.level) url.searchParams.append("level", params.level);
        if (params.search) url.searchParams.append("search", params.search);
        if (params.limit)
          url.searchParams.append("limit", params.limit.toString());
        if (params.offset)
          url.searchParams.append("offset", params.offset.toString());
        if (params.orderBy) url.searchParams.append("orderBy", params.orderBy);
        if (params.orderDirection)
          url.searchParams.append("orderDirection", params.orderDirection);
      }

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: this.getHeaders(),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Erro ao buscar conteúdos");
      }

      return result;
    } catch (error) {
      console.error("Erro ao buscar conteúdos:", error);
      throw error;
    }
  }

  /**
   * Busca conteúdos por ID da disciplina
   */
  async getContentsByDisciplineId(
    disciplineId: string,
    params?: Omit<GetContentsParams, "disciplineId">,
  ): Promise<GetContentsResponse> {
    return this.getAllContents({
      disciplineId,
      ...params,
    });
  }

  /**
   * Busca um conteúdo específico por ID
   */
  async getContentById(id: string): Promise<Content | null> {
    try {
      const response = await fetch(`${this.apiUrl}?id=${id}`, {
        method: "GET",
        headers: this.getHeaders(),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Erro ao buscar conteúdo");
      }

      return result.data;
    } catch (error) {
      console.error("Erro ao buscar conteúdo por ID:", error);
      throw error;
    }
  }

  /**
   * Cria um novo conteúdo
   */
  async createContent(data: Content): Promise<Content> {
    const token = this.getToken();

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

  /**
   * Atualiza um conteúdo existente
   */
  async updateContent(
    id: string,
    data: UpdateContentData,
  ): Promise<{ success: boolean; message: string }> {
    const token = this.getToken();

    if (!token) {
      throw new Error("Usuário não autenticado");
    }

    const response = await fetch(`${this.apiUrl}?id=${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Erro ao atualizar conteúdo");
    }

    return result;
  }

  /**
   * Deleta um conteúdo
   */
  async deleteContent(
    id: string,
  ): Promise<{ success: boolean; message: string }> {
    const token = this.getToken();

    if (!token) {
      throw new Error("Usuário não autenticado");
    }

    const response = await fetch(`${this.apiUrl}?id=${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Erro ao deletar conteúdo");
    }

    return result;
  }
}

export const contentService = new ContentService();
