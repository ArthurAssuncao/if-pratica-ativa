import { neon } from "@neondatabase/serverless";
import type { Handler, HandlerEvent } from "@netlify/functions";

const handler: Handler = async (event: HandlerEvent) => {
  const { type, disciplineId, contentId, slug } =
    event.queryStringParameters || {};

  try {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) throw new Error("DATABASE_URL não configurada.");

    const sql = neon(databaseUrl);

    // Configuração comum de Headers para evitar problemas de CORS se necessário
    const headers = {
      "Content-Type": "application/json",
    };

    switch (type) {
      case "disciplines": {
        const data = await sql`SELECT * FROM disciplines ORDER BY name ASC`;
        return { statusCode: 200, headers, body: JSON.stringify(data) };
      }

      case "contents": {
        if (!disciplineId)
          return {
            statusCode: 400,
            body: JSON.stringify({ error: "disciplineId necessário" }),
          };

        const data = await sql`
          SELECT * FROM contents 
          WHERE discipline_id = ${disciplineId} 
          ORDER BY "order" ASC
        `;
        return { statusCode: 200, headers, body: JSON.stringify(data) };
      }

      case "contentsWithQuestions": {
        if (!disciplineId)
          return {
            statusCode: 400,
            body: JSON.stringify({ error: "disciplineId necessário" }),
          };

        const data = await sql`
            SELECT 
              c.id,
              c.name as content_name,
              c.level as content_level,
              c.slug,
              c."order",
              c.discipline_id,
              q.id as question_id,
              q.metadata,
              q.level as question_level,
              q.question_text,
              q.correct_answer,
              q.explanation,
              q.type
          FROM contents c
          LEFT JOIN questions as q ON q.content_id = c.id
          WHERE c.discipline_id = ${disciplineId} 
          ORDER BY c."order" ASC, q.id ASC
        `;
        return { statusCode: 200, headers, body: JSON.stringify(data) };
      }

      case "questions": {
        if (!contentId)
          return {
            statusCode: 400,
            body: JSON.stringify({ error: "contentId necessário" }),
          };

        const data = await sql`
          SELECT * FROM questions 
          WHERE content_id = ${contentId} 
          ORDER BY id ASC
        `;
        return { statusCode: 200, headers, body: JSON.stringify(data) };
      }

      case "lessons": {
        if (!disciplineId)
          return {
            statusCode: 400,
            body: JSON.stringify({ error: "disciplineId necessário" }),
          };

        const GITHUB_RAW_URL =
          "https://raw.githubusercontent.com/arthurassuncao/if-pratica-ativa-conteudos/main";
        const url = `${GITHUB_RAW_URL}/${disciplineId}/conteudos.json`;

        const response = await fetch(url);

        if (!response.ok) {
          return {
            statusCode: response.status,
            body: JSON.stringify({
              error: "Não foi possível buscar no GitHub",
            }),
          };
        }

        // 1. Extraia os dados reais (o array de lições)
        const jsonData = await response.json();

        // 2. Retorne os dados extraídos
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(jsonData), // Agora sim, enviando o conteúdo real
        };
      }

      case "lessonMarkdown": {
        if (!disciplineId || !slug)
          return {
            statusCode: 400,
            body: JSON.stringify({ error: "disciplineId e slug necessários" }),
          };

        const GITHUB_RAW_URL =
          "https://raw.githubusercontent.com/arthurassuncao/if-pratica-ativa-conteudos/main";
        const url = `${GITHUB_RAW_URL}/${disciplineId}/${slug}.md`;

        const response = await fetch(url);

        if (!response.ok) {
          return {
            statusCode: response.status,
            body: JSON.stringify({
              error: "Não foi possível buscar no GitHub",
            }),
          };
        }

        // 1. Extraia os dados reais (o array de lições)
        const data = await response.text();

        // 2. Retorne os dados extraídos
        return {
          statusCode: 200,
          headers,
          body: data, // Agora sim, enviando o conteúdo real
        };
      }

      // Adicione este caso ao seu switch/router
      case "user_progress": {
        const userId = event.queryStringParameters?.userId; // ID do Netlify Identity
        const disciplineSlug = event.queryStringParameters?.disciplineSlug;

        if (!userId) {
          return {
            statusCode: 400,
            body: JSON.stringify({ error: "userId necessário" }),
          };
        }

        // Busca o progresso do usuário para uma disciplina específica ou geral
        const data = await sql`
    SELECT 
      question_id, 
      discipline_slug,
      attempts, 
      is_correct, 
      solved_at, 
      last_attempt_at
    FROM user_progress 
    WHERE user_id = ${userId}
    ${disciplineSlug ? sql`AND discipline_slug = ${disciplineSlug}` : sql``}
  `;

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(data),
        };
      }

      case "userStats": {
        const userId = event.queryStringParameters?.userId;

        if (!userId) {
          return {
            statusCode: 400,
            body: JSON.stringify({ error: "userId necessário" }),
          };
        }

        // Esta query agrupa por disciplina e conta:
        // - total_attempted: Quantas questões diferentes o usuário tentou
        // - total_solved: Quantas questões diferentes o usuário acertou
        // - total_tries: A soma de todas as tentativas feitas (opcional, para precisão)
        const stats = await sql`
    SELECT 
      discipline_slug,
      COUNT(question_id) as total_attempted,
      COUNT(question_id) FILTER (WHERE is_correct = TRUE) as total_solved,
      SUM(attempts) as total_tries
    FROM user_progress
    WHERE user_id = ${userId}
    GROUP BY discipline_slug
  `;

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(stats),
        };
      }

      default:
        return {
          statusCode: 400,
          body: JSON.stringify({
            error:
              "Tipo de requisição inválido. Use: disciplines, contents, contentsWithQuestions, questions ou lessons.",
          }),
        };
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Erro na Data Function:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erro interno", message: error.message }),
    };
  }
};

export { handler };
