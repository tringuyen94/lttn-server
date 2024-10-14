const express = require('express');
const helmet = require('helmet');
const app = express();
const cors = require('cors');
const path = require('path');
const appApi = require('./routes/api');
// const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('./swagger.json');
const Database = require('./database');
const errorHandler = require('./error-handler');
const { NotFoundError } = require('./response/error.response');
const countVisitor = require('./middlewares/count-visitor');

/**
 * CONNECT Database
 */
Database.getInstance();

/**
 * COUNT VISITORS
 */
app.use(countVisitor);

/**
 * GLOBAL Middlewares
 */
app.use(cors());
app.use(helmet());
/**
 * BODY PARSER
 */
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

//

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
