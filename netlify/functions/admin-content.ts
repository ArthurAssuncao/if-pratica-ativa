// netlify/functions/admin-content.ts
import { neon } from "@neondatabase/serverless";
import type {
  Handler,
  HandlerEvent,
  HandlerResponse,
} from "@netlify/functions";
import jwt from "jsonwebtoken";

interface JWTPayload {
  id: number;
  username: string;
  email: string;
  role: string;
  full_name: string;
}

const defaultHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const handler: Handler = async (
  event: HandlerEvent,
): Promise<HandlerResponse> => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: defaultHeaders, body: "" };
  }

  if (event.httpMethod === "GET") {
    return await handleGetContents(event);
  }

  if (event.httpMethod === "POST") {
    return await handlePostContent(event);
  }

  return {
    statusCode: 405,
    headers: defaultHeaders,
    body: JSON.stringify({ error: "Método não permitido" }),
  };
};

// GET - Buscar conteúdos
async function handleGetContents(
  event: HandlerEvent,
): Promise<HandlerResponse> {
  try {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) throw new Error("DATABASE_URL não configurada.");
    const sql = neon(databaseUrl);

    const { disciplineId } = event.queryStringParameters || {};

    const contents = await sql`
      SELECT
        c.id,
        c.name,
        c.slug,
        c.discipline_id as "disciplineId",
        d.name as "disciplineName",
        c.level,
        c."order"
      FROM contents c
      LEFT JOIN disciplines d ON c.discipline_id = d.id
      WHERE 1=1
        -- Se disciplineId foi passado, aplica o filtro. Se não, ignora.
        AND (${disciplineId ? sql`c.discipline_id = ${disciplineId}` : sql`true`})
      ORDER BY c."order" ASC
    `;

    return {
      statusCode: 200,
      headers: defaultHeaders,
      body: JSON.stringify({ success: true, data: contents }),
    };
  } catch (error) {
    console.error("Erro ao buscar conteúdos:", error);
    return {
      statusCode: 500,
      headers: defaultHeaders,
      body: JSON.stringify({ error: "Erro interno" }),
    };
  }
}

// POST - Criar conteúdo
async function handlePostContent(
  event: HandlerEvent,
): Promise<HandlerResponse> {
  try {
    const authHeader = event.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return {
        statusCode: 401,
        headers: defaultHeaders,
        body: JSON.stringify({ error: "Token não fornecido" }),
      };
    }

    const token = authHeader.split(" ")[1];
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) throw new Error("JWT_SECRET não configurada.");

    const decoded = jwt.verify(token, jwtSecret) as JWTPayload;
    if (decoded.role !== "admin" && decoded.role !== "super_admin") {
      return {
        statusCode: 403,
        headers: defaultHeaders,
        body: JSON.stringify({ error: "Acesso negado" }),
      };
    }

    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) throw new Error("DATABASE_URL não configurada.");
    const sql = neon(databaseUrl);

    const body = JSON.parse(event.body || "{}");

    if (!body.name || !body.disciplineId || !body.level) {
      return {
        statusCode: 400,
        headers: defaultHeaders,
        body: JSON.stringify({
          error:
            "Dados incompletos. 'name', 'disciplineId' e 'level' são obrigatórios.",
        }),
      };
    }

    const id =
      body.id ||
      body.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

    const slug = body.slug || id;

    // Verifica se já existe
    const existing = await sql`
      SELECT id FROM contents
      WHERE (id = ${id} OR slug = ${slug}) AND discipline_id = ${body.disciplineId}
    `;

    if (existing.length > 0) {
      return {
        statusCode: 409,
        headers: defaultHeaders,
        body: JSON.stringify({ error: "Conteúdo já existe nesta disciplina." }),
      };
    }

    // Insere
    await sql`
      INSERT INTO contents (id, name, slug, discipline_id, level, "order", created_at)
      VALUES (${id}, ${body.name}, ${slug}, ${body.disciplineId}, ${body.level}, ${body.order || 0}, NOW())
    `;

    return {
      statusCode: 201,
      headers: defaultHeaders,
      body: JSON.stringify({
        success: true,
        message: "Conteúdo cadastrado com sucesso",
        data: {
          id,
          name: body.name,
          slug,
          disciplineId: body.disciplineId,
          level: body.level,
          order: body.order || 0,
        },
      }),
    };
  } catch (error) {
    console.error("Erro ao cadastrar conteúdo:", error);
    return {
      statusCode: 500,
      headers: defaultHeaders,
      body: JSON.stringify({ error: "Erro interno" }),
    };
  }
}

export { handler };
