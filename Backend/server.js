/**
 * Server Entry Point
 * This file only handles starting the server.
 * Express app configuration is in app.js
 */

const path = require("path");
const { app, initializeDatabase } = require("./app");

// Initialize database and start server
const startServer = async () => {
  // Connect database and sync models
  await initializeDatabase();

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📁 Serving static files from: ${path.join(__dirname, 'uploads')}`);
  });
};

// Only start server if this file is run directly (not imported)
if (require.main === module) {
  startServer();
}

module.exports = { startServer };