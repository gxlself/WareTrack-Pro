import dotenv from 'dotenv';
dotenv.config();

import { app, server } from './app';
import { InventoryAlerts } from './middleware/inventoryAlerts';
import { prisma } from './lib/prisma';

const PORT = Number(process.env.PORT) || 8080;

console.log('📚 Swagger documentation available at /api-docs');

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

console.log('⚠️  Redis disabled - running without caching and queues');

async function startServer() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    // Start inventory alerts
    InventoryAlerts.startScheduledCheck();

    server.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'not set'}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
      console.log('⚡ Ready to handle requests!');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
