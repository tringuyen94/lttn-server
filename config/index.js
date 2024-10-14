const config = {
  dev: {
    server: {
      port: process.env.DEV_SERVER_PORT,
    },
    database: {
      host: process.env.DEV_DB_HOST,
      port: process.env.DEV_DB_PORT,
      name: process.env.DEV_DB_NAME,
    },
  },
  prod: {
    server: {
      port: process.env.PROD_SERVER_PORT,
    },
    database: {
      host: process.env.PROD_DB_HOST,
      port: process.env.PROD_DB_PORT,
      name: process.env.PROD_DB_NAME,
    },
  },
};
module.exports = config[process.env.NODE_ENV];
