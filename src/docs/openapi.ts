import type { OpenAPIV3 } from 'openapi-types';

const bearerAuth: OpenAPIV3.SecuritySchemeObject = {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
};

const errorSchema = (description: string): OpenAPIV3.ResponseObject => ({
  description,
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          code: { type: 'string', example: 'UNAUTHORIZED' },
          message: { type: 'string', example: description },
        },
      },
    },
  },
});

const userSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    id: { type: 'string', example: 'clx1abc123' },
    email: { type: 'string', format: 'email', example: 'user@example.com' },
    name: { type: 'string', example: 'João Silva' },
    photoUrl: { type: 'string', format: 'uri', nullable: true, example: 'https://example.com/photo.jpg' },
    provider: { type: 'string', enum: ['GOOGLE', 'APPLE'] },
    providerId: { type: 'string' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
};

const authResponseSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    token: { type: 'string', description: 'JWT válido por 30 dias', example: 'eyJhbGciOi...' },
    user: userSchema,
  },
};

const bookSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    id: { type: 'integer', example: 1 },
    slug: { type: 'string', example: 'genesis' },
    name: { type: 'string', example: 'Gênesis' },
    testament: { type: 'string', enum: ['OLD', 'NEW'] },
    chapters: { type: 'integer', example: 50 },
  },
};

const bookDetailSchema: OpenAPIV3.SchemaObject = {
  allOf: [
    bookSchema,
    {
      type: 'object',
      properties: {
        readChapters: { type: 'array', items: { type: 'integer' }, example: [1, 2, 3] },
        readings: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              chapter: { type: 'integer', example: 1 },
              readAt: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
    },
  ],
};

const chapterReadSchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    id: { type: 'string', example: 'clx1abc123' },
    userId: { type: 'string' },
    bookId: { type: 'integer' },
    chapter: { type: 'integer' },
    readAt: { type: 'string', format: 'date-time' },
  },
};

const progressSummarySchema: OpenAPIV3.SchemaObject = {
  type: 'object',
  properties: {
    totalChapters: { type: 'integer', example: 1334 },
    totalRead: { type: 'integer', example: 42 },
    percent: { type: 'number', example: 3.15 },
    booksCompleted: { type: 'integer', example: 1 },
    booksTotal: { type: 'integer', example: 73 },
    books: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          bookId: { type: 'integer' },
          slug: { type: 'string' },
          name: { type: 'string' },
          testament: { type: 'string', enum: ['OLD', 'NEW'] },
          totalChapters: { type: 'integer' },
          readChapters: { type: 'integer' },
          completed: { type: 'boolean' },
        },
      },
    },
  },
};

export const openApiSpec: OpenAPIV3.Document = {
  openapi: '3.0.3',
  info: {
    title: 'Guia API',
    description: 'API para acompanhamento de leitura da Bíblia Católica (73 livros)',
    version: '0.1.0',
  },
  tags: [
    { name: 'Auth', description: 'Autenticação via Google e Apple' },
    { name: 'Users', description: 'Perfil do usuário autenticado' },
    { name: 'Books', description: 'Livros da Bíblia' },
    { name: 'Progress', description: 'Progresso de leitura por capítulo' },
  ],
  components: {
    securitySchemes: { bearerAuth },
    schemas: {
      User: userSchema,
      AuthResponse: authResponseSchema,
      Book: bookSchema,
      BookDetail: bookDetailSchema,
      ChapterRead: chapterReadSchema,
      ProgressSummary: progressSummarySchema,
    },
  },
  paths: {
    '/health': {
      get: {
        summary: 'Health check',
        tags: ['Auth'],
        responses: {
          '200': {
            description: 'Serviço online',
            content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string', example: 'ok' } } } } },
          },
        },
      },
    },

    '/auth/google': {
      post: {
        summary: 'Autenticar com Google',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['idToken'],
                properties: {
                  idToken: { type: 'string', description: 'ID token retornado pelo SDK do Google' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Autenticado com sucesso',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } },
          },
          '401': errorSchema('Token do Google inválido'),
        },
      },
    },

    '/auth/apple': {
      post: {
        summary: 'Autenticar com Apple',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['idToken'],
                properties: {
                  idToken: { type: 'string', description: 'ID token retornado pelo SDK da Apple' },
                  name: { type: 'string', description: 'Nome do usuário (enviado apenas no primeiro login)' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Autenticado com sucesso',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } },
          },
          '401': errorSchema('Token da Apple inválido'),
        },
      },
    },

    '/me': {
      get: {
        summary: 'Obter perfil do usuário',
        tags: ['Users'],
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Perfil do usuário',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } },
          },
          '401': errorSchema('Não autenticado'),
          '404': errorSchema('Usuário não encontrado'),
        },
      },
      patch: {
        summary: 'Atualizar perfil do usuário',
        tags: ['Users'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', minLength: 1, maxLength: 100 },
                  photoUrl: { type: 'string', format: 'uri', nullable: true },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Perfil atualizado',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } },
          },
          '400': errorSchema('Dados inválidos'),
          '401': errorSchema('Não autenticado'),
        },
      },
    },

    '/books': {
      get: {
        summary: 'Listar todos os livros da Bíblia',
        tags: ['Books'],
        responses: {
          '200': {
            description: 'Lista dos 73 livros',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/Book' } },
              },
            },
          },
        },
      },
    },

    '/books/{slug}': {
      get: {
        summary: 'Obter livro com progresso de leitura',
        tags: ['Books'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'slug', in: 'path', required: true, schema: { type: 'string', example: 'genesis' } },
        ],
        responses: {
          '200': {
            description: 'Livro com capítulos lidos pelo usuário',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/BookDetail' } } },
          },
          '401': errorSchema('Não autenticado'),
          '404': errorSchema('Livro não encontrado'),
        },
      },
    },

    '/progress/{bookId}/{chapter}': {
      post: {
        summary: 'Marcar capítulo como lido',
        tags: ['Progress'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'bookId', in: 'path', required: true, schema: { type: 'integer', example: 1 } },
          { name: 'chapter', in: 'path', required: true, schema: { type: 'integer', example: 1 } },
        ],
        responses: {
          '201': {
            description: 'Leitura registrada',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ChapterRead' } } },
          },
          '400': errorSchema('Capítulo inválido'),
          '401': errorSchema('Não autenticado'),
          '404': errorSchema('Livro não encontrado'),
        },
      },
      delete: {
        summary: 'Desmarcar capítulo como lido',
        tags: ['Progress'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'bookId', in: 'path', required: true, schema: { type: 'integer', example: 1 } },
          { name: 'chapter', in: 'path', required: true, schema: { type: 'integer', example: 1 } },
        ],
        responses: {
          '204': { description: 'Leitura removida' },
          '401': errorSchema('Não autenticado'),
        },
      },
    },

    '/progress/summary': {
      get: {
        summary: 'Resumo do progresso de leitura',
        tags: ['Progress'],
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Progresso geral e por livro',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ProgressSummary' } } },
          },
          '401': errorSchema('Não autenticado'),
        },
      },
    },
  },
};
