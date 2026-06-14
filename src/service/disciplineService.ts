import type { Discipline } from "../types/study";

interface DisciplineResponse extends Discipline {
  created_at: string;
}

class DisciplineService {
  private apiUrl = "/.netlify/functions/admin-discipline";

  async createDiscipline(data: Discipline): Promise<DisciplineResponse> {
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
      throw new Error(result.error || "Erro ao cadastrar disciplina");
    }

    return result.data;
  }

  async getDisciplines(): Promise<Discipline[]> {
    const token =
      localStorage.getItem("admin_token") ||
      sessionStorage.getItem("admin_token");

    const response = await fetch(this.apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Erro ao carregar disciplinas");
    }

    return result.data;
  }
}

export const disciplineService = new DisciplineService();
