# guia-backend

API REST para um app de acompanhamento de leitura da Bíblia Católica.

## Stack

- Node.js + TypeScript + Express
- PostgreSQL + Prisma ORM
- Auth: ID token Google/Apple → JWT próprio
- Validação com Zod

## Setup

```bash
cp .env.example .env
# edite .env preenchendo GOOGLE_CLIENT_ID, APPLE_CLIENT_ID e JWT_SECRET
docker compose up -d
npm install
npx prisma migrate dev --name init
npm run db:seed
npm run dev
```

A API sobe em `http://localhost:3000`.

## Endpoints (MVP)

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| GET | `/health` | — | Healthcheck |
| POST | `/auth/google` | — | Troca ID token Google por JWT |
| POST | `/auth/apple` | — | Troca ID token Apple por JWT |
| GET | `/me` | JWT | Perfil do usuário |
| PATCH | `/me` | JWT | Atualiza nome/foto |
| GET | `/books` | — | Lista os 73 livros |
| GET | `/books/:slug` | JWT | Detalhe do livro + capítulos lidos |
| POST | `/progress/:bookId/:chapter` | JWT | Marca capítulo como lido |
| DELETE | `/progress/:bookId/:chapter` | JWT | Desmarca capítulo |
| GET | `/progress/summary` | JWT | Resumo de progresso |

## Scripts

- `npm run dev` — inicia em modo watch
- `npm run build` — compila para `dist/`
- `npm start` — roda o build compilado
- `npm run db:migrate` — aplica migrações
- `npm run db:seed` — popula os 73 livros
- `npm run db:studio` — Prisma Studio
- `npm run lint` / `npm run format`

## Estrutura

```
src/
  config/         # env
  db/             # prisma client, seed
  lib/            # jwt, errors
  middlewares/    # auth, error, validate
  modules/
    auth/         # Google + Apple verifiers, JWT
    users/        # /me
    books/        # lista e detalhe de livros
    progress/     # marcação de capítulos e summary
  app.ts
  server.ts
prisma/
  schema.prisma
```

## Pós-MVP

- Módulos `friends` (follow/unfollow) e `ranking` (por capítulos / livros)
- Testes automatizados
- CI/CD e deploy
