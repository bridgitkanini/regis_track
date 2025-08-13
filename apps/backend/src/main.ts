import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { createServer } from 'http';
import connectDB from './config/database';
import routes from './routes';
import { ApiError } from './middleware/error.middleware';
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger';

// Initialize express app
import { Express } from 'express';

const app: Express = express();
const server = createServer(app);

// Connect to MongoDB
connectDB();

// TEMPORARILY DISABLE HELMET
// app.use(helmet());

// SIMPLE CORS CONFIGURATION FOR DEBUGGING
console.log('🔧 Starting server with simplified CORS...');

app.use(
  cors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false, // TEMPORARILY DISABLED
  })
);

// Add debugging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`📨 ${req.method} ${req.url} - Origin: ${req.headers.origin}`);
  next();
});

// Parse JSON request body
app.use(express.json({ limit: '10kb' }));

// Parse URL-encoded request body
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Logging in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

// Swagger UI setup - BEFORE main routes
const swaggerOptions = {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'RegisTrack API Documentation',
};

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(specs, swaggerOptions));

// Swagger JSON endpoint
app.get('/swagger.json', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(specs);
});

// Test endpoint - BEFORE main routes
app.get('/test', (req: Request, res: Response) => {
  console.log('🧪 Test endpoint hit');
  res.json({
    message: 'Test route is working!',
    timestamp: new Date().toISOString(),
  });
});

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'RegisTrack API Server',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      swagger: '/swagger',
      test: '/test',
      api: '/api',
    },
  });
});

// Mount API routes - These come AFTER individual routes
app.use('/', routes);

// Handle 404 - This catches anything that didn't match above
app.use((req: Request, res: Response) => {
  console.log(`❌ 404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: 'Not Found',
    error: {
      statusCode: 404,
      message: `The requested resource '${req.originalUrl}' was not found`,
    },
  });
});

// Global error handler - MUST be last
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // Default error status and message
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let error = { ...err };
  error.message = message;

  // Handle specific error types
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val: any) => val.message);
    message = `Validation Error: ${messages.join(', ')}`;
    statusCode = 400;
  }

  // Log the error for debugging
  console.error(
    `[${new Date().toISOString()}] ${statusCode} - ${message} - ${
      req.originalUrl
    } - ${req.method} - ${req.ip}`
  );
  console.error(err.stack);

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    error: {
      statusCode,
      message,
      stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
    },
  });
});

// Start server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log('🚀 =================================');
  console.log(`🚀 Server running on: http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/swagger`);
  console.log(`🧪 Test endpoint: http://localhost:${port}/test`);
  console.log(`💊 Health check: http://localhost:${port}/health`);
  console.log('🚀 =================================');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  // Close server & exit process
  process.exit(1);
});

// SIGTERM signal handling for Heroku
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});

export default app;
