const express = require('express');
const helmet = require('helmet');
const app = express();
const cors = require('cors');
const path = require('path');
const appApi = require('./routes/api');
const cookieParser = require('cookie-parser');
const Database = require('./database');
const errorHandler = require('./error-handler');
const { NotFoundError } = require('./response/error.response');
const countVisitor = require('./middlewares/count-visitor');

/**
 * CONNECT Database
 */
Database.getInstance();

/**
 * GLOBAL Middlewares
 */
app.use(
  cors({
    origin: 'http://localhost:5173', // Your frontend's URL
    credentials: true,
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      // scriptSrc: ["'self'", 'cdnjs.cloudflare.com'], // Allow external script sources
      // imgSrc: ["'self'", 'your-image-domain.com'], // Allow image domain
      // styleSrc: ["'self'", "'unsafe-inline'"], // Allow inline styles
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

//
/**
 * COUNT VISITORS
 */
app.use(countVisitor);

// API
app.use('/api/v1', appApi);

/**
 * ERROR HANDLE
 */

app.use((req, res, next) => {
  throw new NotFoundError(`${req.originalUrl} Not exists`);
});
app.use(errorHandler);

module.exports = app;
