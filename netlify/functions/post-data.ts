import { neon } from "@neondatabase/serverless";
import type { Handler, HandlerEvent } from "@netlify/functions";

const handler: Handler = async (event: HandlerEvent) => {
  // Para POST, o 'type' pode vir na query, mas os dados vêm no body
  const { type } = event.queryStringParameters || {};
  const headers = { "Content-Type": "application/json" };

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Método não permitido" }),
    };
  }

  try {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) throw new Error("DATABASE_URL não configurada.");
    const sql = neon(databaseUrl);

    const body = event.body ? JSON.parse(event.body) : {};

    switch (type) {
      case "user": {
        const { id, email, full_name, avatar_url } = body;

        if (!id || !email) {
          return {
            statusCode: 400,
            body: JSON.stringify({ error: "Dados de usuário incompletos" }),
          };
        }

        await sql`
          INSERT INTO profiles (id, email, full_name, avatar_url, updated_at)
          VALUES (${id}, ${email}, ${full_name}, ${avatar_url}, NOW())
          ON CONFLICT (id) DO UPDATE SET
            full_name = EXCLUDED.full_name,
            avatar_url = EXCLUDED.avatar_url,
            updated_at = NOW()
        `;

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ message: "Perfil sincronizado" }),
        };
      }

      case "userProgress": {
        const { user_id, question_id, discipline_slug, is_correct } = body;

        if (!user_id || !question_id || !discipline_slug) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: "Dados de progresso incompletos" }),
          };
        }

        try {
          await sql`
      INSERT INTO user_progress (
        user_id, 
        question_id, 
        discipline_slug, 
        attempts, 
        is_correct, 
        solved_at, 
        last_attempt_at
      )
      VALUES (
        ${user_id}, 
        ${question_id}, 
        ${discipline_slug}, 
        1, 
        ${is_correct}, 
        ${is_correct ? sql`NOW()` : null}, 
        NOW()
      )
      ON CONFLICT (user_id, question_id) 
      DO UPDATE SET
        attempts = user_progress.attempts + 1,
        last_attempt_at = NOW(),
        -- Só atualiza solved_at se o usuário ACERTOU agora e nunca tinha acertado antes
        solved_at = CASE 
          WHEN ${is_correct} = TRUE AND user_progress.is_correct = FALSE THEN NOW() 
          ELSE user_progress.solved_at 
        END,
        -- Se já acertou uma vez, permanece TRUE para sempre
        is_correct = user_progress.is_correct OR ${is_correct}
    `;

          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              message: "Progresso atualizado com sucesso",
            }),
          };
        } catch (error) {
          console.error("Erro ao salvar progresso:", error);
          return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: "Erro interno ao salvar progresso" }),
          };
        }
      }

      default:
        return {
          statusCode: 400,
          body: JSON.stringify({
            error: "Tipo de requisição inválido. Use: user ou userProgress",
          }),
        };
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Erro na Post Data Function:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erro interno", message: error.message }),
    };
  }
};

export { handler };
