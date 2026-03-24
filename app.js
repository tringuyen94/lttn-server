const express = require('express');
const helmet = require('helmet');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const appApi = require('./routes/api');
const cookieParser = require('cookie-parser');
const rateLimit = require('./middlewares/rate-limit');
const Database = require('./database');
const errorHandler = require('./error-handler');
const { NotFoundError } = require('./response/error.response');
const countVisitor = require('./middlewares/count-visitor');

/**
 * Validate required environment variables
 */
const REQUIRED_ENV = ['JWT_SECRET', 'COOKIE_SECRET'];
for (const key of REQUIRED_ENV) {
  if (!process.env[key]) {
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

/**
 * CONNECT Database
 */
Database.getInstance();

/**
 * GLOBAL Middlewares
 */
app.use(morgan(process.env.NODE_ENV === 'prod' ? 'combined' : 'dev'));

const allowedOrigins = (process.env.CORS_ORIGINS || '').split(',').map((o) => o.trim()).filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (!allowedOrigins.length || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
    },
  })
);

app.use(cookieParser(process.env.COOKIE_SECRET));

/**
 * BODY PARSER
 */
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

/**
 * COUNT VISITORS
 */
app.use(countVisitor);

/**
 * HEALTH CHECK
 */
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'LTTN API Server' });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

// API
app.use('/api/v1', apiRateLimiter, appApi);

/**
 * ERROR HANDLE
 */
app.use((req, res, next) => {
  throw new NotFoundError(`${req.originalUrl} Not exists`);
});
app.use(errorHandler);

module.exports = app;
