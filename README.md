# 📝 Artgios API

API REST para uma plataforma de publicação de artigos desenvolvida com NestJS.

O objetivo do projeto é permitir que usuários criem uma conta, publiquem seus próprios artigos, interajam com publicações de outros usuários através de curtidas e comentários, além de gerenciar todo o seu conteúdo.

---

## 🚀 Tecnologias

- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Bcrypt
- Docker
- PNPM

---

# ✨ Funcionalidades

## Autenticação

- Cadastro de usuário
- Login com JWT
- Rotas protegidas
- Controle de permissões

---

## Usuários

Cada usuário poderá:

- Criar uma conta
- Fazer login
- Publicar artigos
- Editar seus artigos
- Excluir seus artigos
- Curtir artigos
- Comentar em artigos

---

## Artigos

Cada artigo possui:

| Campo       | Tipo     |
| ----------- | -------- |
| title       | string   |
| description | string   |
| content     | string   |
| tags        | string[] |
| cover       | string   |
| createdAt   | Date     |

---

# 📚 Endpoints

## 👤 Usuário

### Cadastro

```
POST /users/register
```

Body

```json
{
  "name": "Guilherme",
  "email": "guilherme@email.com",
  "password": "123456"
}
```

---

### Login

```
POST /auth/login
```

Body

```json
{
  "email": "guilherme@email.com",
  "password": "123456"
}
```

---

## 📝 Artigos

### Criar artigo

```
POST /articles
```

Body

```json
{
  "title": "Meu primeiro artigo",
  "description": "Descrição",
  "content": "Conteúdo completo...",
  "tags": ["nestjs", "typescript"],
  "cover": "https://..."
}
```

---

### Editar artigo

```
PUT /articles/:id
```

Body

```json
{
  "title": "Novo título",
  "description": "Nova descrição",
  "content": "Novo conteúdo",
  "tags": ["backend", "api"],
  "cover": "https://..."
}
```

---

### Excluir artigo

```
DELETE /articles/:id
```

---

### Meus artigos

```
GET /articles/me
```

Resposta

```json
[
  {
    "title": "Meu artigo",
    "createdAt": "2026-07-04",
    "likes": 25,
    "comments": 8,
    "tags": ["nestjs", "backend"]
  }
]
```

---

## 🌎 Feed

```
GET /feed
```

Retorno

```json
[
  {
    "title": "Aprendendo NestJS",
    "description": "Introdução ao framework",
    "image": "https://...",
    "tags": ["nestjs"],
    "user": {
      "name": "Guilherme"
    },
    "createdAt": "2026-07-04",
    "likes": 150,
    "comments": 37
  }
]
```

---

## 📖 Visualizar artigo

```
GET /articles/:id
```

Retorno

```json
{
  "title": "Aprendendo NestJS",
  "description": "Descrição",
  "content": "Conteúdo completo...",
  "image": "https://...",
  "tags": ["nestjs", "typescript"],
  "user": {
    "name": "Guilherme"
  },
  "createdAt": "2026-07-04",
  "likes": 100,
  "comments": [
    {
      "user": {
        "name": "João"
      },
      "createdAt": "2026-07-04",
      "comment": "Excelente artigo!"
    }
  ]
}
```

---

# 🔒 Autenticação

A API utiliza autenticação baseada em JWT.

Para acessar endpoints protegidos envie o token no header:

```
Authorization: Bearer <token>
```

---

# 📦 Instalação

Clone o projeto

```bash
git clone https://github.com/seu-usuario/artgios-api.git
```

Instale as dependências

```bash
pnpm install
```

Configure o arquivo `.env`

```env
DATABASE_URL=

JWT_SECRET=

MAIL_HOST=
MAIL_PORT=
MAIL_USER=
MAIL_PASS=
```

Execute as migrations

```bash
pnpm prisma migrate dev
```

Inicie a aplicação

```bash
pnpm run start:dev
```

---

# 🛠️ Scripts

```bash
pnpm run start
pnpm run start:dev
pnpm run build
pnpm run lint
pnpm run test
```

---

# 📌 Roadmap

- [x] Autenticação
- [x] CRUD de usuários
- [x] CRUD de artigos
- [x] Sistema de curtidas
- [x] Sistema de comentários
- [ ] Upload de imagens
- [ ] Pesquisa por tags
- [ ] Paginação
- [ ] Perfil do usuário
- [ ] Favoritos
- [ ] Testes automatizados

---

# 📄 Licença

Este projeto está licenciado sob a licença MIT.
