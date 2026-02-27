const mongoose = require('mongoose');
const app = require('./app');
const {
  server: { port },
} = require('./config');

const webService = app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});

const gracefulShutdown = (reason) => {
  console.log(`Shutting down server (${reason})...`);
  webService.close(() => {
    mongoose.connection.close(false).then(() => {
      console.log('Database connection closed');
      process.exit(reason === 'SIGTERM' || reason === 'SIGINT' ? 0 : 1);
    });
  });
};

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('unhandledRejection');
});

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
