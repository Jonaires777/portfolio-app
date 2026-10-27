# Insight Hub

Sistema de gestão de fornecedores, com cadastro, edição, visualização e exclusão, autenticação por e-mail/senha ou GitHub e redefinição de senha por e-mail.

**Acesse:** https://insight-challenge-snowy.vercel.app

> A lista de fornecedores é pública. Para criar, editar ou excluir, crie uma conta ou entre com o GitHub.

## Funcionalidades

- Listagem paginada de fornecedores, com skeleton durante o carregamento
- Cadastro, edição, visualização em detalhes e exclusão de fornecedores
- Cadastro e login com e-mail e senha (senhas armazenadas com BCrypt)
- Login com GitHub via OAuth2, vinculando contas pelo e-mail verificado
- Redefinição de senha por e-mail, com link de uso único que expira em 30 minutos
- Autenticação stateless com JWT
- Layout responsivo

## Tecnologias

**Backend**
- Java 21 e Spring Boot 3.3
- Spring Security (OAuth2 Client e Resource Server com JWT)
- Spring Data MongoDB
- Lombok
- Resend (API HTTP) para envio de e-mails

**Frontend**
- React 18 e TypeScript
- Ant Design 5 e Tailwind CSS
- React Router 6
- Axios

**Infraestrutura**
- MongoDB Atlas (banco de dados)
- Railway (API, via Dockerfile)
- Vercel (frontend)

## Estrutura

```
backend/        API REST em Spring Boot
  config/         segurança, JWT, OAuth2 e seed inicial
  controllers/    endpoints REST
  services/       regras de negócio, e-mail e tokens
  model/          documentos do MongoDB e DTOs
  repositories/   acesso ao MongoDB
frontend-app/   aplicação React
  components/     páginas, layouts e componentes comuns
  contexts/       contexto de autenticação
  services/       chamadas à API
```

## API

| Método | Rota | Autenticação |
|---|---|---|
| GET | `/api/fornecedores` | pública |
| GET | `/api/fornecedores/{id}` | pública |
| POST | `/api/fornecedores/create` | JWT |
| PUT | `/api/fornecedores/edit/{id}` | JWT |
| DELETE | `/api/fornecedores/{id}` | JWT |
| POST | `/api/auth/register` | pública |
| POST | `/api/auth/login` | pública |
| GET | `/api/auth/me` | JWT |
| POST | `/api/auth/forgot-password` | pública |
| POST | `/api/auth/reset-password` | pública |
| GET | `/oauth2/authorization/github` | inicia o login com GitHub |

Rotas protegidas esperam o header `Authorization: Bearer <token>`.

## Rodando localmente

### Opção 1: Docker Compose

Com o Docker instalado, na raiz do projeto:

```bash
docker compose up --build
```

Isso sobe o MongoDB, a API em `http://localhost:8080` e o frontend em `http://localhost:3000`. Para derrubar tudo, use `docker compose down` (acrescente `-v` para apagar também os dados do banco).

O login com GitHub e o envio de e-mails não funcionam nesse modo sem as variáveis descritas em [Variáveis de ambiente](#variáveis-de-ambiente).

### Opção 2: Manualmente

**Pré-requisitos:** Java 21, Node.js e um MongoDB (local ou Atlas).

#### 1. MongoDB

Com Docker:

```bash
docker run -d --name insight-mongo -p 27017:27017 mongo:7
```

#### 2. Backend

```bash
cd backend
export JWT_SECRET="um-segredo-local-com-pelo-menos-32-caracteres"
export FRONTEND_URL="http://localhost:3000"
./mvnw spring-boot:run        # no Windows: mvnw.cmd spring-boot:run
```

A API sobe em `http://localhost:8080`. Se o banco estiver vazio, são criados 1000 fornecedores de exemplo.

Sem `RESEND_API_KEY`, o e-mail de redefinição de senha não é enviado: o link aparece no log do backend, para testar o fluxo localmente.

#### 3. Frontend

```bash
cd frontend-app
npm install
npm start
```

O app abre em `http://localhost:3000` e, por padrão, usa a API em `http://localhost:8080`.

## Variáveis de ambiente

**Backend**

| Variável | Obrigatória | Descrição |
|---|---|---|
| `JWT_SECRET` | sim | Segredo para assinar os tokens (mínimo de 32 caracteres) |
| `MONGO_URI` | não | Connection string do MongoDB (padrão: `mongodb://localhost:27017/insight-challenge`) |
| `MONGO_DATABSE` | não | Nome do banco (padrão: `insight-challenge`) |
| `FRONTEND_URL` | não | URL do frontend, usada nos links de e-mail e no retorno do OAuth2 |
| `CORS_ALLOWED_ORIGINS` | não | Origens permitidas, separadas por vírgula |
| `JWT_EXPIRATION_HOURS` | não | Validade do token (padrão: 24) |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | para login com GitHub | Credenciais do OAuth App do GitHub |
| `RESEND_API_KEY` | para enviar e-mails | Chave da API do Resend |
| `MAIL_FROM` | não | Remetente dos e-mails |

No OAuth App do GitHub, a callback URL deve ser `<url-do-backend>/login/oauth2/code/github`.

**Frontend**

| Variável | Descrição |
|---|---|
| `REACT_APP_BASE_URL` | URL da API (padrão: `http://localhost:8080`). É lida no momento do build. |

## Autor

Desenvolvido por **Jonathan**: [LinkedIn](https://www.linkedin.com/in/jonaires/) · [GitHub](https://github.com/Jonaires777)
