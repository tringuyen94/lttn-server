const app = require('./app');
const {
  server: { port },
} = require('./config');

const webService = app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Perform any necessary cleanup
  webService.close(() => {
    console.log('Shutting down server due to uncaught exception...');
    process.exit(1); // Exit the app
  });
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Perform any necessary cleanup, like closing database connections, etc.
  // Shutdown the server
  webService.close(() => {
    console.log('Shutting down server...');
    process.exit(1); // Exit with failure
  });
});
