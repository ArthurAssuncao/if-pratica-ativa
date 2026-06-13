// services/adminAuth.ts
interface LoginResponse {
  success: boolean;
  token?: string;
  user?: {
    id: number;
    username: string;
    email: string;
    role: string;
    full_name: string;
    profile_picture: string | null;
  };
  error?: string;
}

class AdminAuthService {
  private apiUrl = "/.netlify/functions/admin-login";

  async login(
    identifier: string,
    password: string,
    rememberMe: boolean = false,
  ): Promise<LoginResponse> {
    try {
      const response = await fetch(`${this.apiUrl}?type=login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identifier, password, rememberMe }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem("admin_token", data.token);
        storage.setItem("admin_user", JSON.stringify(data.user));

        return {
          success: true,
          token: data.token,
          user: data.user,
        };
      }

      return {
        success: false,
        error: data.error || "Erro no login",
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return {
        success: false,
        error: "Erro ao conectar com o servidor",
      };
    }
  }

  async verifyToken(): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;

    try {
      const response = await fetch(`${this.apiUrl}?type=verify`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      return response.ok && data.valid;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return false;
    }
  }

  async changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<boolean> {
    const token = this.getToken();
    const user = this.getUser();

    if (!token || !user) return false;

    try {
      const response = await fetch(`${this.apiUrl}?type=changePassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: user.id,
          currentPassword,
          newPassword,
        }),
      });

      await response.json();
      return response.ok;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return false;
    }
  }

  getToken(): string | null {
    return (
      localStorage.getItem("admin_token") ||
      sessionStorage.getItem("admin_token")
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getUser(): any | null {
    const userStr =
      localStorage.getItem("admin_user") ||
      sessionStorage.getItem("admin_user");
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  logout(): void {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    sessionStorage.removeItem("admin_token");
    sessionStorage.removeItem("admin_user");
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const adminAuth = new AdminAuthService();
