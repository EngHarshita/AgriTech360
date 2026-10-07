import swaggerJSDoc from 'swagger-jsdoc';
import { config } from './environment';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'AgriTech360 API Documentation',
    version: '1.0.0',
    description:
      'Production-ready backend API documentation for AgriTech360 smart farming platform, covering Authentication, Farmer Profiles, and Telemetry.',
    contact: {
      name: 'AgriTech360 Engineering Team',
      email: 'support@agritech360.com'
    }
  },
  servers: [
    {
      url: `http://localhost:${config.port}${config.apiPrefix}`,
      description: 'Local Development Server (API v1)'
    },
    {
      url: `http://localhost:${config.port}`,
      description: 'Root Server'
    }
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your Bearer JWT token in the format: Bearer <token>'
      }
    },
    schemas: {
      SafeUser: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '67045b85a36df1e29c8e9451' },
          name: { type: 'string', example: 'Ramesh Patel' },
          email: { type: 'string', format: 'email', example: 'ramesh.patel@example.com' },
          phone: { type: 'string', example: '+919876543210' },
          district: { type: 'string', example: 'Nashik' },
          state: { type: 'string', example: 'Maharashtra' },
          landHolding: { type: 'number', example: 4.5 },
          soilType: { type: 'string', example: 'Black Soil' },
          irrigationType: { type: 'string', example: 'Drip Irrigation' },
          role: {
            type: 'string',
            enum: ['farmer', 'expert', 'buyer', 'admin'],
            example: 'farmer'
          },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      UpdateProfileInput: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'Ramesh Kumar Patel' },
          phone: { type: 'string', example: '+919876543211' },
          district: { type: 'string', example: 'Pune' },
          state: { type: 'string', example: 'Maharashtra' },
          landHolding: { type: 'number', example: 6.0 },
          soilType: { type: 'string', example: 'Alluvial Soil' },
          irrigationType: { type: 'string', example: 'Sprinkler Irrigation' }
        }
      },
      ProfileResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          user: { $ref: '#/components/schemas/SafeUser' }
        }
      },
      ProfileUpdateResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Profile updated successfully' },
          user: { $ref: '#/components/schemas/SafeUser' }
        }
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Validation failed' },
          statusCode: { type: 'integer', example: 400 },
          errors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                field: { type: 'string' },
                message: { type: 'string' }
              }
            }
          },
          timestamp: { type: 'string', format: 'date-time' }
        }
      }
    }
  }
};

const options: swaggerJSDoc.Options = {
  swaggerDefinition,
  apis: ['./src/routes/*.ts', './dist/routes/*.js']
};

export const swaggerSpec = swaggerJSDoc(options);
