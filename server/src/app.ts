import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { config } from './config';
import { swaggerSpec } from './config/swagger';
import { requestLogger, errorHandler, notFoundHandler } from './middleware';
import apiRouter from './routes';
import healthRoutes from './routes/healthRoutes';
import { sendSuccess } from './utils/apiResponse';

const app: Application = express();

// 1. Security HTTP headers (allowing swagger inline assets)
app.use(
  helmet({
    contentSecurityPolicy: false
  })
);

// 2. Cross-Origin Resource Sharing
app.use(
  cors({
    origin: config.corsOrigin === '*' ? '*' : [config.corsOrigin, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  })
);

// 3. Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 4. HTTP Request Logging
app.use(requestLogger);

// 5. Swagger UI & OpenAPI Documentation
app.use(`${config.apiPrefix}/docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get(`${config.apiPrefix}/docs.json`, (_req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Top-level aliases for documentation
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 6. Root Info Endpoint
app.get('/', (_req: Request, res: Response) => {
  sendSuccess(res, 'AgriTech360 Backend API is running', {
    name: 'AgriTech360 API',
    version: '1.0.0',
    documentation: `${config.apiPrefix}/docs`,
    healthCheck: `${config.apiPrefix}/health`
  });
});

// Top-level /health route for cloud load balancers and orchestrators
app.use('/health', healthRoutes);

// 7. Versioned API routes (/api/v1)
app.use(config.apiPrefix, apiRouter);

// 8. 404 handler for undefined routes
app.use(notFoundHandler);

// 9. Centralized error handling middleware
app.use(errorHandler);

export default app;
