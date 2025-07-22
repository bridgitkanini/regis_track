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

// Initialize express app
const app = express();
const server = createServer(app);

// Connect to MongoDB
connectDB();

// Set security HTTP headers
app.use(helmet());

// Enable CORS
app.use(cors());

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

// API routes
app.use('/', routes);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Handle 404
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Not Found',
    error: {
      statusCode: 404,
      message: 'The requested resource was not found',
    },
  });
});

// Global error handler
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
  console.error(`[${new Date().toISOString()}] ${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
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
const PORT = process.env.PORT || 3333;
const NODE_ENV = process.env.NODE_ENV || 'development';

server.listen(PORT, () => {
  console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`);
  console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
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
