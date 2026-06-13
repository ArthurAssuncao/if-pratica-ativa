import { neon } from "@neondatabase/serverless";
import type {
  Handler,
  HandlerEvent,
  HandlerResponse,
} from "@netlify/functions";
import jwt from "jsonwebtoken";

interface Discipline {
  id: string;
  name: string;
  iconSlug: string;
}

interface JWTPayload {
  id: number;
  username: string;
  email: string;
  role: string;
  full_name: string;
}

// Headers padrão
const defaultHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const handler: Handler = async (
  event: HandlerEvent,
): Promise<HandlerResponse> => {
  // Preflight request
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: defaultHeaders,
      body: "",
    };
  }

  // Só aceita POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: defaultHeaders,
      body: JSON.stringify({ error: "Método não permitido" }),
    };
  }

  try {
    // 1. Valida o token JWT
    const authHeader = event.headers.authorization;
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

    // Verifica e decodifica o token
    let decoded: JWTPayload;
    try {
      decoded = jwt.verify(token, jwtSecret) as JWTPayload;
    } catch (error) {
      return {
        statusCode: 401,
        headers: defaultHeaders,
        body: JSON.stringify({ error: "Token inválido ou expirado" + error }),
      };
    }

    // 2. Verifica se o usuário é admin ou super_admin
    if (decoded.role !== "admin" && decoded.role !== "super_admin") {
      return {
        statusCode: 403,
        headers: defaultHeaders,
        body: JSON.stringify({
          error:
            "Acesso negado. Apenas administradores podem cadastrar disciplinas.",
        }),
      };
    }

    // 3. Conecta ao banco de dados
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) throw new Error("DATABASE_URL não configurada.");
    const sql = neon(databaseUrl);

    // 4. Parse do body
    const body: Discipline = JSON.parse(event.body || "{}");

    // 5. Valida os dados obrigatórios
    if (!body.name || !body.iconSlug) {
      return {
        statusCode: 400,
        headers: defaultHeaders,
        body: JSON.stringify({
          error: "Dados incompletos. 'name' e 'iconSlug' são obrigatórios.",
        }),
      };
    }

    // 6. Verifica se já existe disciplina com mesmo nome ou slug
    const existingDiscipline = await sql`
      SELECT id, name, icon_slug FROM disciplines
      WHERE id = ${body.id} OR name = ${body.name}
    `;

    if (existingDiscipline.length > 0) {
      return {
        statusCode: 409,
        headers: defaultHeaders,
        body: JSON.stringify({
          error: "Já existe uma disciplina com este id ou nome.",
        }),
      };
    }

    // 7. Insere a nova disciplina
    const result = await sql`
      INSERT INTO disciplines (
        id,
        name,
        icon_slug,
        created_at
      ) VALUES (
        ${body.id},
        ${body.name},
        ${body.iconSlug},
        NOW()
      )
      RETURNING id, name, icon_slug, created_at
    `;

    // 8. Retorna a disciplina criada
    return {
      statusCode: 201,
      headers: defaultHeaders,
      body: JSON.stringify({
        success: true,
        message: "Disciplina cadastrada com sucesso",
        data: result[0],
      }),
    };
  } catch (error) {
    console.error("Erro ao cadastrar disciplina:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Erro interno";
    return {
      statusCode: 500,
      headers: defaultHeaders,
      body: JSON.stringify({ error: "Erro interno", message: errorMessage }),
    };
  }
};

export { handler };
