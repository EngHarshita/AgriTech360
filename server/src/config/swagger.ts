import swaggerJSDoc from 'swagger-jsdoc';
import { config } from './environment';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'AgriTech360 API Documentation',
    version: '1.0.0',
    description:
      'Production-ready backend API documentation for AgriTech360 smart farming platform, covering Authentication, Farmer Profiles, and Dashboard Telemetry.',
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
      FarmMetric: {
        type: 'object',
        required: ['title', 'value', 'unit', 'trend'],
        properties: {
          id: { type: 'string', example: 'total-land' },
          title: { type: 'string', example: 'Total Land' },
          value: { type: 'number', example: 6.5 },
          unit: { type: 'string', example: 'Acres' },
          trend: {
            type: 'string',
            enum: ['up', 'down', 'stable'],
            example: 'up'
          },
          change: { type: 'string', example: '+0.5 Acres vs last season' },
          isPositive: { type: 'boolean', example: true },
          description: {
            type: 'string',
            example: 'Registered arable farmland in Nashik, Maharashtra'
          },
          iconName: { type: 'string', example: 'ShieldCheck' }
        }
      },
      DashboardMetricsResponse: {
        type: 'object',
        required: ['success', 'metrics'],
        properties: {
          success: { type: 'boolean', example: true },
          metrics: {
            type: 'array',
            items: { $ref: '#/components/schemas/FarmMetric' }
          }
        }
      },
      WeatherIntelligence: {
        type: 'object',
        required: [
          'location',
          'temperature',
          'humidity',
          'windSpeed',
          'rainfallProbability',
          'soilTemperature',
          'evapotranspiration',
          'spraySuitability',
          'advisory',
          'forecast24h',
          'forecast7d'
        ],
        properties: {
          location: { type: 'string', example: 'Nashik' },
          state: { type: 'string', example: 'Maharashtra' },
          temperature: { type: 'number', example: 29 },
          humidity: { type: 'number', example: 62 },
          windSpeed: { type: 'number', example: 12 },
          rainfallProbability: { type: 'number', example: 18 },
          soilTemperature: { type: 'number', example: 27 },
          evapotranspiration: { type: 'number', example: 3.8 },
          spraySuitability: {
            type: 'string',
            enum: ['Excellent', 'Good', 'Fair', 'Poor'],
            example: 'Good'
          },
          advisory: {
            type: 'string',
            example: 'Suitable conditions for spraying pesticides and fertilizers.'
          },
          forecast24h: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                time: { type: 'string', example: '12:00' },
                temp: { type: 'number', example: 31 },
                condition: { type: 'string', example: 'Sunny' },
                icon: { type: 'string', example: 'Sun' },
                pop: { type: 'number', example: 15 },
                windSpeed: { type: 'number', example: 12 }
              }
            }
          },
          forecast7d: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                date: { type: 'string', example: '2026-10-08' },
                dayName: { type: 'string', example: 'Today' },
                maxTemp: { type: 'number', example: 30 },
                minTemp: { type: 'number', example: 21 },
                condition: { type: 'string', example: 'Partly Cloudy' },
                icon: { type: 'string', example: 'CloudSun' },
                rainfallMm: { type: 'number', example: 0 },
                humidity: { type: 'number', example: 62 },
                spraySuitability: { type: 'string', example: 'Good' }
              }
            }
          }
        }
      },
      WeatherResponse: {
        type: 'object',
        required: ['success', 'weather'],
        properties: {
          success: { type: 'boolean', example: true },
          weather: { $ref: '#/components/schemas/WeatherIntelligence' }
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
