import { neon } from "@neondatabase/serverless";
import { Handler } from "@netlify/functions";

/**
 * Esta função serve como ponte segura entre o seu frontend React e o banco de dados Neon.
 * O Netlify executa este código no servidor, garantindo que as credenciais fiquem ocultas.
 */
const handler: Handler = async (event) => {
  // 1. Extraímos o contentId dos parâmetros da URL
  // Exemplo de chamada: /.netlify/functions/get-questions?contentId=python-basico
  const contentId = event.queryStringParameters?.contentId;

  if (!contentId) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error:
          "O parâmetro contentId é obrigatório para localizar as questões.",
      }),
    };
  }

  try {
    /**
     * 2. Inicializamos a ligação com o Neon.
     * O process.env.DATABASE_URL deve ser configurado no painel do Netlify
     * (Site Settings > Environment Variables).
     */
    const sql = neon(process.env.DATABASE_URL!);

    /**
     * 3. Executamos a consulta SQL.
     * O campo 'metadata' (JSONB) é convertido automaticamente pelo driver em um objeto JS.
     */
    const questions = await sql`
      SELECT 
        id, 
        content_id, 
        type, 
        level, 
        question_text, 
        correct_answer, 
        explanation, 
        code_snippet, 
        metadata 
      FROM questions 
      WHERE content_id = ${contentId}
      ORDER BY id ASC
    `;

    // 4. Retornamos os dados para o Hook 'useDatabase' no React
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        // Cache opcional para melhorar a performance de acesso repetido
        "Cache-Control": "public, max-age=3600",
      },
      body: JSON.stringify(questions),
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // Log de erro visível apenas nos logs do Netlify (seguro)
    console.error("Erro ao aceder ao banco de dados Neon:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Erro interno ao processar a requisição de dados.",
        message: error.message,
      }),
    };
  }
};

export { handler };
