require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/notes';

async function startServer() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    const server = app.listen(PORT, () => {
      console.log(`🚀 API disponible sur http://localhost:${PORT}`);
    });

    const shutdown = () => {
      console.log('⛔ Arrêt du serveur...');
      server.close(() => {
        mongoose.connection.close(false, () => {
          console.log('🛑 Connexions MongoDB fermées');
          process.exit(0);
        });
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (err) {
    console.error('❌ Impossible de démarrer le serveur :', err.message);
    process.exit(1);
  }
}

startServer();

module.exports = app;