const mongoose = require('mongoose');

const DOCUMENT_NAME = 'Counter';
const counterSchema = new mongoose.Schema(
  {
    visitors: {
      type: Number,
    },
  },
  { collection: DOCUMENT_NAME }
);
module.exports = mongoose.model(DOCUMENT_NAME, counterSchema);
