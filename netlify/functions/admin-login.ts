// netlify/functions/admin-login.ts
import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import type {
  Handler,
  HandlerEvent,
  HandlerResponse,
} from "@netlify/functions";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Tipos
interface LoginBody {
  identifier: string;
  password: string;
  rememberMe?: boolean;
}

interface ChangePasswordBody {
  id: number;
  currentPassword: string;
  newPassword: string;
}

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  role: string;
  full_name: string;
  profile_picture: string | null;
  login_attempts: number;
  locked_until: Date | null;
}

interface UserResponse {
  id: number;
  username: string;
  email: string;
  role: string;
  full_name: string;
  profile_picture: string | null;
}

// Tipo para a função SQL do Neon
type SqlType = NeonQueryFunction<false, false>;

// Headers padrão
const defaultHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

const handler: Handler = async (
  event: HandlerEvent,
): Promise<HandlerResponse> => {
  const { type } = event.queryStringParameters || {};

  // Preflight request
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: defaultHeaders,
      body: "",
    };
  }

  // Para o tipo "verify", aceita GET
  if (type === "verify" && event.httpMethod === "GET") {
    return await handleVerify(event);
  }

  // Para os outros tipos, só aceita POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: defaultHeaders,
      body: JSON.stringify({ error: "Método não permitido" }),
    };
  }

  try {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) throw new Error("DATABASE_URL não configurada.");
    const sql: SqlType = neon(databaseUrl);

    const body = event.body ? JSON.parse(event.body) : {};

    switch (type) {
      case "login": {
        return await handleLogin(body as LoginBody, event, sql);
      }

      case "verify": {
        return await handleVerify(event);
      }

      case "logout": {
        return {
          statusCode: 200,
          headers: defaultHeaders,
          body: JSON.stringify({ message: "Logout realizado com sucesso" }),
        };
      }

      case "changePassword": {
        return await handleChangePassword(body as ChangePasswordBody, sql);
      }

      default:
        return {
          statusCode: 400,
          headers: defaultHeaders,
          body: JSON.stringify({
            error:
              "Tipo de requisição inválido. Use: login, verify, logout, changePassword",
          }),
        };
    }
  } catch (error) {
    console.error("Erro na Admin Login Function:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Erro interno";
    return {
      statusCode: 500,
      headers: defaultHeaders,
      body: JSON.stringify({ error: "Erro interno", message: errorMessage }),
    };
  }
};

// Handler específico para login
async function handleLogin(
  body: LoginBody,
  event: HandlerEvent,
  sql: SqlType,
): Promise<HandlerResponse> {
  const { identifier, password, rememberMe } = body;

  if (!identifier || !password) {
    return {
      statusCode: 400,
      headers: defaultHeaders,
      body: JSON.stringify({ error: "Usuário/email e senha são obrigatórios" }),
    };
  }

  // Busca usuário no banco
  const users = await sql`
    SELECT
      id,
      username,
      email,
      password_hash,
      role,
      full_name,
      profile_picture,
      login_attempts,
      locked_until
    FROM admin_users
    WHERE (username = ${identifier} OR email = ${identifier})
  `;

  if (users.length === 0) {
    return {
      statusCode: 401,
      headers: defaultHeaders,
      body: JSON.stringify({ error: "Usuário ou senha inválidos" }),
    };
  }

  const user = users[0];

  // Verifica se usuário está bloqueado
  if (user.locked_until && new Date(user.locked_until) > new Date()) {
    const minutosRestantes = Math.ceil(
      (new Date(user.locked_until).getTime() - new Date().getTime()) / 60000,
    );
    return {
      statusCode: 423,
      headers: defaultHeaders,
      body: JSON.stringify({
        error: `Conta bloqueada temporariamente. Tente novamente em ${minutosRestantes} minutos.`,
      }),
    };
  }

  // Verifica senha
  const isValidPassword = await bcrypt.compare(password, user.password_hash);

  if (!isValidPassword) {
    // Incrementa tentativas de login
    const newAttempts = (user.login_attempts || 0) + 1;

    if (newAttempts >= 5) {
      await sql`
        UPDATE admin_users
        SET login_attempts = ${newAttempts},
            locked_until = NOW() + INTERVAL '15 minutes'
        WHERE id = ${user.id}
      `;

      return {
        statusCode: 423,
        headers: defaultHeaders,
        body: JSON.stringify({
          error:
            "Muitas tentativas incorretas. Conta bloqueada por 15 minutos.",
        }),
      };
    } else {
      await sql`
        UPDATE admin_users
        SET login_attempts = ${newAttempts}
        WHERE id = ${user.id}
      `;
    }

    return {
      statusCode: 401,
      headers: defaultHeaders,
      body: JSON.stringify({ error: "Usuário ou senha inválidos" }),
    };
  }

  // Login bem sucedido
  await sql`
    UPDATE admin_users
    SET login_attempts = 0,
        locked_until = NULL,
        last_login_at = NOW(),
        last_login_ip = ${event.headers["x-forwarded-for"] || "0.0.0.0"}
    WHERE id = ${user.id}
  `;

  // Gera token JWT
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) throw new Error("JWT_SECRET não configurada.");

  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      full_name: user.full_name,
    },
    jwtSecret,
    { expiresIn: rememberMe ? "30d" : "8h" },
  );

  const userResponse: UserResponse = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    full_name: user.full_name,
    profile_picture: user.profile_picture,
  };

  return {
    statusCode: 200,
    headers: defaultHeaders,
    body: JSON.stringify({
      success: true,
      message: "Login realizado com sucesso",
      token,
      user: userResponse,
    }),
  };
}

// Handler específico para verify (aceita GET)
async function handleVerify(event: HandlerEvent): Promise<HandlerResponse> {
  const authHeader = event.headers.authorization;

  console.log(
    "Verify - Authorization header:",
    authHeader ? "Presente" : "Ausente",
  );

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      statusCode: 401,
      headers: defaultHeaders,
      body: JSON.stringify({ error: "Token não fornecido" }),
    };
  }

  const token = authHeader.split(" ")[1];
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    console.error("JWT_SECRET não configurada");
    return {
      statusCode: 500,
      headers: defaultHeaders,
      body: JSON.stringify({ error: "Erro na configuração do servidor" }),
    };
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    console.log("Verify - Token válido para:", decoded);

    return {
      statusCode: 200,
      headers: defaultHeaders,
      body: JSON.stringify({
        valid: true,
        user: decoded,
      }),
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Token inválido";
    console.error("Verify - Token inválido:", errorMessage);
    return {
      statusCode: 401,
      headers: defaultHeaders,
      body: JSON.stringify({ error: "Token inválido ou expirado" }),
    };
  }
}

// Handler para alteração de senha
async function handleChangePassword(
  body: ChangePasswordBody,
  sql: SqlType,
): Promise<HandlerResponse> {
  const { id, currentPassword, newPassword } = body;

  if (!id || !currentPassword || !newPassword) {
    return {
      statusCode: 400,
      headers: defaultHeaders,
      body: JSON.stringify({
        error: "Dados incompletos para alteração de senha",
      }),
    };
  }

  const users = await sql`
    SELECT id, password_hash
    FROM admin_users
    WHERE id = ${id}
  `;

  if (users.length === 0) {
    return {
      statusCode: 404,
      headers: defaultHeaders,
      body: JSON.stringify({ error: "Usuário não encontrado" }),
    };
  }

  const user = users[0];
  const isValidPassword = await bcrypt.compare(
    currentPassword,
    user.password_hash,
  );

  if (!isValidPassword) {
    return {
      statusCode: 401,
      headers: defaultHeaders,
      body: JSON.stringify({ error: "Senha atual incorreta" }),
    };
  }

  const salt = await bcrypt.genSalt(12);
  const newHash = await bcrypt.hash(newPassword, salt);

  await sql`
    UPDATE admin_users
    SET password_hash = ${newHash}
    WHERE id = ${id}
  `;

  return {
    statusCode: 200,
    headers: defaultHeaders,
    body: JSON.stringify({ message: "Senha alterada com sucesso" }),
  };
}

export { handler };
