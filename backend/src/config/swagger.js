const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');

const API_BASE_URL = process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 3000}`;

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Notes App API',
    version: '1.0.0',
    description: 'API RESTful pour la gestion de notes avec authentification JWT, catégories et fichiers joints.'
  },
  servers: [
    {
      url: API_BASE_URL
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      Attachment: {
        type: 'object',
        properties: {
          filename: { type: 'string', example: 'capture.png' },
          url: { type: 'string', example: '/uploads/capture-123.png' },
          mimeType: { type: 'string', example: 'image/png' },
          size: { type: 'integer', example: 204800 }
        }
      },
      Note: {
        type: 'object',
        properties: {
          _id: { type: 'string', format: 'uuid' },
          userId: { type: 'string' },
          title: { type: 'string' },
          content: { type: 'string' },
          category: { type: 'string', enum: ['travail', 'personnel', 'urgent'] },
          tags: {
            type: 'array',
            items: { type: 'string' }
          },
          attachments: {
            type: 'array',
            items: { $ref: '#/components/schemas/Attachment' }
          },
          color: { type: 'string', example: '#FF8A65' },
          archived: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      NoteInput: {
        type: 'object',
        required: ['title'],
        properties: {
          title: { type: 'string', example: 'Préparer la réunion' },
          content: { type: 'string', example: 'Penser au support et aux annexes.' },
          category: { type: 'string', enum: ['travail', 'personnel', 'urgent'] },
          tags: {
            type: 'array',
            items: { type: 'string' }
          },
          attachments: {
            type: 'array',
            items: { $ref: '#/components/schemas/Attachment' }
          },
          color: { type: 'string', example: '#FFE082' },
          archived: { type: 'boolean' }
        }
      },
      AuthCredentials: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', example: 'user@example.com' },
          password: { type: 'string', example: 'Password123!' }
        }
      },
      AuthResponse: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          token: { type: 'string' }
        }
      },
      UploadResponse: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          attachments: {
            type: 'array',
            items: { $ref: '#/components/schemas/Attachment' }
          },
          note: { $ref: '#/components/schemas/Note' }
        }
      }
    }
  }
};

const options = {
  definition: swaggerDefinition,
  apis: [
    path.join(__dirname, '../routes/*.js')
  ]
};

module.exports = swaggerJsdoc(options);
