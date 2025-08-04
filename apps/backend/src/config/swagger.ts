import swaggerJsdoc from 'swagger-jsdoc';
import { version } from '../../package.json';
import path from 'path';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'RegisTrack API Documentation',
      version,
      description: 'API documentation for RegisTrack backend services',
      contact: {
        name: 'API Support',
        email: 'support@registrack.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Member: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'The auto-generated ID of the member',
              example: '507f1f77bcf86cd799439011'
            },
            firstName: {
              type: 'string',
              description: 'First name of the member',
              example: 'John'
            },
            lastName: {
              type: 'string',
              description: 'Last name of the member',
              example: 'Doe'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email address of the member',
              example: 'john.doe@example.com'
            },
            phone: {
              type: 'string',
              description: 'Phone number of the member',
              example: '+1234567890'
            },
            dateOfBirth: {
              type: 'string',
              format: 'date',
              description: 'Date of birth of the member',
              example: '1990-01-01'
            },
            gender: {
              type: 'string',
              enum: ['male', 'female', 'other'],
              description: 'Gender of the member'
            },
            status: {
              type: 'string',
              enum: ['active', 'inactive', 'pending'],
              default: 'active',
              description: 'Status of the member'
            },
            profilePicture: {
              type: 'string',
              description: 'URL to the member\'s profile picture',
              example: 'uploads/profile-pictures/12345.jpg'
            },
            createdBy: {
              type: 'string',
              description: 'ID of the user who created this member',
              example: '507f1f77bcf86cd799439012'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date and time when the member was created'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date and time when the member was last updated'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              description: 'Error message',
              example: 'An error occurred'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Use absolute paths that work from the compiled location
  apis: [
    path.join(__dirname, '../routes/*.ts'),
    path.join(__dirname, '../models/*.ts'), 
    path.join(__dirname, '../controllers/*.ts'),
    // Also include the source files for development
    path.join(process.cwd(), 'apps/backend/src/routes/*.ts'),
    path.join(process.cwd(), 'apps/backend/src/models/*.ts'),
    path.join(process.cwd(), 'apps/backend/src/controllers/*.ts'),
  ],
};

export const specs = swaggerJsdoc(options);