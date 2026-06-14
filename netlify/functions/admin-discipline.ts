// netlify/functions/admin-disciplines.ts
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
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
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

  // GET - Buscar disciplinas (público ou autenticado)
  if (event.httpMethod === "GET") {
    return await handleGetDisciplines(event);
  }

  // POST - Criar nova disciplina (requer autenticação)
  if (event.httpMethod === "POST") {
    return await handlePostDiscipline(event);
  }

  // Outros métodos não permitidos
  return {
    statusCode: 405,
    headers: defaultHeaders,
    body: JSON.stringify({ error: "Método não permitido" }),
  };
};

// Handler para GET (listar disciplinas)
async function handleGetDisciplines(
  event: HandlerEvent,
): Promise<HandlerResponse> {
  try {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) throw new Error("DATABASE_URL não configurada.");
    const sql = neon(databaseUrl);

    // Parâmetros de consulta
    const { search } = event.queryStringParameters || {};

    // Verifica se é uma requisição admin (tem token)
    let isAdmin = false;
    const authHeader = event.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const token = authHeader.split(" ")[1];
        const jwtSecret = process.env.JWT_SECRET;
        if (jwtSecret) {
          const decoded = jwt.verify(token, jwtSecret) as JWTPayload;
          isAdmin = decoded.role === "admin" || decoded.role === "super_admin";
        }
      } catch (error) {
        // Token inválido, continua como não admin
        console.error("Erro ao validar token:", error);
      }
    }

    // Monta a query
    let query = sql`
      SELECT
        id,
        name,
        icon_slug as "iconSlug",
        created_at
      FROM disciplines
      WHERE 1=1
    `;

    // Filtro por ativo/inativo (se tiver campo is_active)
    // Se não tiver o campo is_active, ignore esta parte

    // Busca por nome
    if (search) {
      query = sql`${query} AND name ILIKE ${`%${search}%`}`;
    }

    // Ordenação
    query = sql`${query} ORDER BY name ASC`;

    const disciplines = await query;

    return {
      statusCode: 200,
      headers: defaultHeaders,
      body: JSON.stringify({
        success: true,
        data: disciplines,
        isAdmin, // útil para saber se o usuário pode editar
      }),
    };
  } catch (error) {
    console.error("Erro ao buscar disciplinas:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Erro interno";
    return {
      statusCode: 500,
      headers: defaultHeaders,
      body: JSON.stringify({ error: "Erro interno", message: errorMessage }),
    };
  }
}

// Handler para POST (criar disciplina)
async function handlePostDiscipline(
  event: HandlerEvent,
): Promise<HandlerResponse> {
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

    // Gera o ID a partir do nome se não foi fornecido
    const id = body.id || body.name.toLowerCase().replace(/\s+/g, "-");

    // 6. Verifica se já existe disciplina com mesmo id ou nome
    const existingDiscipline = await sql`
      SELECT id, name FROM disciplines
      WHERE id = ${id} OR name = ${body.name}
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
        created_at,
        updated_at
      ) VALUES (
        ${id},
        ${body.name},
        ${body.iconSlug},
        NOW(),
        NOW()
      )
      RETURNING id, name, icon_slug as "iconSlug", created_at
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
}

export { handler };
