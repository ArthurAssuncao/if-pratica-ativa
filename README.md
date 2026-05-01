[![Netlify Status](https://api.netlify.com/api/v1/badges/e5fe6eb8-eac7-47cc-9cd3-7f5c7a795524/deploy-status)](https://app.netlify.com/projects/if-pratica-ativa/deploys)

# 📘 Prática Ativa - Plataforma de Estudos

Plataforma de aprendizado interativo que combina gestão de aulas em Markdown com um sistema de quizzes para fixação de conteúdo. O projeto foca em uma experiência de usuário fluida, com suporte nativo a temas (dark/light) e autenticação robusta.

---

## 🚀 Tecnologias Utilizadas

### **Frontend Core**

- **React 18** com **TypeScript**: Tipagem estrita para maior segurança e manutenção.
- **Vite**: Tooling de build ultrarrápido.
- **Tailwind CSS**: Estilização utilitária e responsiva.
- **Lucide React**: Biblioteca de ícones leves e consistentes.

### **Backend & Autenticação**

- **Netlify Identity**: Gestão de usuários e autenticação via Google OAuth.
- **Netlify Functions**: Serverless functions para lógica de backend.
- **Neon (PostgreSQL)**: Banco de dados serverless para armazenamento de progresso e estatísticas.

### **Hooks & Ferramentas**

- **Custom Hooks**:
  - `useAuth`: Gerenciamento de estado de autenticação (com suporte a Mock em Localhost).
  - `useIsMobile`: Detecção inteligente de breakpoints via `matchMedia`.
  - `useLessonMarkdown`: Fetching e gerenciamento de conteúdo didático.
- **ESLint**: Padronização de código e boas práticas de React.

---

## 🛠️ Funcionalidades

- **Autenticação**: Login simplificado via Google integrado ao Netlify Identity.
- **Textbook**: Renderizador de aulas baseado em arquivos Markdown com suporte a realce de sintaxe.
- **Dashboard de Estatísticas**: Visualização de progresso, precisão de acertos e pontuação do aluno.
- **Interface Adaptativa**:
  - Sidebar responsiva que se ajusta a diferentes resoluções.
  - Navegação entre aulas (Anterior/Próxima).
  - Suporte completo a Dark Mode.

---

## 📦 Estrutura de Pastas (Principais)

```text
src/
├── assets/          # Imagens e recursos estáticos
├── components/      # Componentes reutilizáveis (UI, Stats, Sidebar)
├── data/            # Mocks para desenvolvimento local (USER_MOCKED)
├── hook/            # Hooks customizados (useAuth, useIsMobile, useDatabase)
├── types/           # Definições de interfaces TypeScript
└── util/            # Funções utilitárias (Helpers de localhost, etc.)
```

---

## 🔧 Configuração para Desenvolvimento

### Executando o projeto

1. Clone o repositório:

```bash
git clone https://github.com/netlify-labs/if-pratica-ativa.git
```

2. Entre na pasta do projeto:

```bash
cd if-pratica-ativa
```

3. Instale as dependências:

```bash
npm install
```

4. Instale o Netlify CLI:

```bash
npm install netlify-cli -g
```

5. Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis de ambiente:

```bash
# URL do banco de dados
DATABASE_URL=https://<nome-do-site>.banco.com
```

6. Login no Netlify:

```bash
netlify login
```

7. Link a sua conta do Netlify:

```bash
netlify link
```

8. Inicie o projeto:

```bash
netlify dev
```

O projeto agora estará disponível em `http://localhost:5173` ou `http://localhost:8888`.

---

## 📝 Notas de Implementação

- **Tratamento de CORS**: Configurado para operar via Netlify CLI para sincronizar com a instância de produção.
- **Performance**: Utilização de `useMemo` para evitar re-renderizações pesadas no processamento de Markdown.
- **Responsividade**: Implementada via Tailwind e monitorada via `matchMedia` para garantir que elementos como o nome do usuário e estatísticas se adaptem ao espaço disponível.

---

## 📄 Licença

Este projeto está sob a licença GPLv3 - veja o arquivo [LICENSE](LICENSE) para detalhes.
