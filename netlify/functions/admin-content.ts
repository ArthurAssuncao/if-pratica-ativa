// netlify/functions/admin-content.ts
import { neon } from "@neondatabase/serverless";
import type {
  Handler,
  HandlerEvent,
  HandlerResponse,
} from "@netlify/functions";
import jwt from "jsonwebtoken";

interface Content {
  id: string;
  name: string;
  slug: string;
  disciplineId: number;
  disciplineName?: string;
  level: string;
  order: number;
  iconSlug?: string;
  description?: string;
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

  // GET - Buscar conteúdos
  if (event.httpMethod === "GET") {
    return await handleGetContents(event);
  }

  // POST - Criar novo conteúdo (requer autenticação)
  if (event.httpMethod === "POST") {
    return await handlePostContent(event);
  }

  // Outros métodos não permitidos
  return {
    statusCode: 405,
    headers: defaultHeaders,
    body: JSON.stringify({ error: "Método não permitido" }),
  };
};

// Handler para GET (listar conteúdos)
async function handleGetContents(
  event: HandlerEvent,
): Promise<HandlerResponse> {
  try {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) throw new Error("DATABASE_URL não configurada.");
    const sql = neon(databaseUrl);

    // Parâmetros de consulta
    const {
      disciplineId,
      level,
      search,
      limit,
      offset,
      orderBy = "order",
      orderDirection = "ASC",
    } = event.queryStringParameters || {};

    // Verifica se é uma requisição admin (para ver itens inativos)
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
        console.log("Erro ao validar token:", error);
      }
    }

    // Monta a query base
    let query = sql`
      SELECT
        c.id,
        c.name,
        c.slug,
        c.discipline_id as "disciplineId",
        d.name as "disciplineName",
        c.level,
        c."order",
        c.icon_slug as "iconSlug",
        c.description,
        c.is_active as "isActive",
        c.created_at as "createdAt",
        c.updated_at as "updatedAt"
      FROM contents c
      LEFT JOIN disciplines d ON c.discipline_id = d.id
      WHERE 1=1
    `;

    // Filtro por disciplina
    if (disciplineId) {
      query = sql`${query} AND c.discipline_id = ${parseInt(disciplineId)}`;
    }

    // Filtro por nível
    if (level) {
      query = sql`${query} AND c.level = ${level}`;
    }

    // Filtro por busca (nome)
    if (search) {
      query = sql`${query} AND c.name ILIKE ${`%${search}%`}`;
    }

    // Se não for admin, mostra apenas ativos
    if (!isAdmin) {
      query = sql`${query} AND c.is_active = true`;
    }

    // Ordenação
    const validOrderColumns = ["order", "name", "created_at", "updated_at"];
    const orderColumn = validOrderColumns.includes(orderBy) ? orderBy : "order";
    const direction = orderDirection.toUpperCase() === "DESC" ? "DESC" : "ASC";
    query = sql`${query} ORDER BY c.${orderColumn} ${direction}`;

    // Paginação
    if (limit) {
      query = sql`${query} LIMIT ${parseInt(limit)}`;
    }
    if (offset) {
      query = sql`${query} OFFSET ${parseInt(offset)}`;
    }

    const contents = await query;

    // Contagem total (para paginação)
    let countQuery = sql`
      SELECT COUNT(*) as total
      FROM contents c
      WHERE 1=1
    `;

    if (disciplineId) {
      countQuery = sql`${countQuery} AND c.discipline_id = ${parseInt(disciplineId)}`;
    }
    if (level) {
      countQuery = sql`${countQuery} AND c.level = ${level}`;
    }
    if (search) {
      countQuery = sql`${countQuery} AND c.name ILIKE ${`%${search}%`}`;
    }
    if (!isAdmin) {
      countQuery = sql`${countQuery} AND c.is_active = true`;
    }

    const countResult = await countQuery;
    const total = parseInt(countResult[0]?.total || "0");

    return {
      statusCode: 200,
      headers: defaultHeaders,
      body: JSON.stringify({
        success: true,
        data: contents,
        pagination: {
          total,
          limit: limit ? parseInt(limit) : contents.length,
          offset: offset ? parseInt(offset) : 0,
        },
        isAdmin,
      }),
    };
  } catch (error) {
    console.error("Erro ao buscar conteúdos:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Erro interno";
    return {
      statusCode: 500,
      headers: defaultHeaders,
      body: JSON.stringify({ error: "Erro interno", message: errorMessage }),
    };
  }
}

// Handler para POST (criar conteúdo)
async function handlePostContent(
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
            "Acesso negado. Apenas administradores podem cadastrar conteúdos.",
        }),
      };
    }

    // 3. Conecta ao banco de dados
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) throw new Error("DATABASE_URL não configurada.");
    const sql = neon(databaseUrl);

    // 4. Parse do body
    const body: Content = JSON.parse(event.body || "{}");

    // 5. Valida os dados obrigatórios
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

    // Gera o ID e slug a partir do nome se não foi fornecido
    const id =
      body.id ||
      body.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

    const slug = body.slug || id;

    // 6. Verifica se já existe conteúdo com mesmo id ou slug na mesma disciplina
    const existingContent = await sql`
      SELECT id, name FROM contents
      WHERE (id = ${id} OR slug = ${slug}) AND discipline_id = ${body.disciplineId}
    `;

    if (existingContent.length > 0) {
      return {
        statusCode: 409,
        headers: defaultHeaders,
        body: JSON.stringify({
          error: "Já existe um conteúdo com este ID ou slug nesta disciplina.",
        }),
      };
    }

    // 7. Verifica se a disciplina existe
    const discipline = await sql`
      SELECT id FROM disciplines WHERE id = ${body.disciplineId}
    `;

    if (discipline.length === 0) {
      return {
        statusCode: 404,
        headers: defaultHeaders,
        body: JSON.stringify({
          error: "Disciplina não encontrada.",
        }),
      };
    }

    // 8. Insere o novo conteúdo
    await sql`
      INSERT INTO contents (
        id,
        name,
        slug,
        discipline_id,
        level,
        "order",
        icon_slug,
        created_at
      ) VALUES (
        ${id},
        ${body.name},
        ${slug},
        ${body.disciplineId},
        ${body.level},
        ${body.order || 0},
        ${body.iconSlug || null},
        ${decoded.id},
        NOW()
      )
      RETURNING
        id,
        name,
        slug,
        discipline_id as "disciplineId",
        level,
        "order",
        icon_slug as "iconSlug",
        created_at as "createdAt"
    `;

    // Busca o nome da disciplina para retornar
    const contentWithDiscipline = await sql`
      SELECT
        c.id,
        c.name,
        c.slug,
        c.discipline_id as "disciplineId",
        c.level,
        c."order",
        c.icon_slug as "iconSlug",
        c.created_at as "createdAt"
      FROM contents c
      LEFT JOIN disciplines d ON c.discipline_id = d.id
      WHERE c.id = ${id}
    `;

    // 9. Retorna o conteúdo criado
    return {
      statusCode: 201,
      headers: defaultHeaders,
      body: JSON.stringify({
        success: true,
        message: "Conteúdo cadastrado com sucesso",
        data: contentWithDiscipline[0],
      }),
    };
  } catch (error) {
    console.error("Erro ao cadastrar conteúdo:", error);
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
