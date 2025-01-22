const mongoose = require('mongoose');
const {
  database: { host, port, name },
} = require('../config');
const URI = `mongodb://${host}:${port}/${name}`;

class Database {
  constructor() {
    this.connect();
  }
  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
  connect() {
    mongoose.connect(URI).then(() => console.log('Database connected'));
  }
}

module.exports = Database;
