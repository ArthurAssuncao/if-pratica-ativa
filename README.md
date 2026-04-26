# IF Pratica Ativa

## Executando o projeto

### Pré-requisitos

- [Node.js](https://nodejs.org/en/) versão 16.x ou superior
- [Yarn](https://yarnpkg.com/) versão 1.x ou superior

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

O projeto agora estará disponível em `http://localhost:5173`.

### Executando o projeto no Netlify

1. Acesse o [Netlify](https://app.netlify.com/) e crie uma nova aplicação.
2. Selecione o repositório do projeto.
3. Clique em "Deploy site".
4. Selecione a branch `main`.
5. Clique em "Deploy site".

O projeto agora estará disponível em `https://<nome-do-site>.netlify.app`.
