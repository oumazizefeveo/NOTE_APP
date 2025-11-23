require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require('xss-clean');
const hpp = require('hpp');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const authRoute = require('./routes/authRoute');
const noteRoute = require('./routes/noteRoute');
const uploadRoute = require('./routes/uploadRoute');

const app = express();

const FRONTEND_ORIGIN = process.env.FRONTEND_URL || 'http://localhost:5173';

// Observability & security middlewares
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(cors({ origin: FRONTEND_ORIGIN, credentials: true }));
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 100 }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
// app.use(mongoSanitize());
// app.use(xssClean());
// app.use(hpp());

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Swagger documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));

// Health endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/auth', authRoute);
app.use('/api/notes', noteRoute);
app.use('/api/upload', uploadRoute);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route introuvable' });
});

// Global error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'Erreur interne du serveur'
  });
});

module.exports = app;
