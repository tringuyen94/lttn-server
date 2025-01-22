const mongoose = require('mongoose');

const DOCUMENT_NAME = 'Video';

const VideoSchema = new mongoose.Schema(
  {
    video_url: { type: String, required: true },
  },
  { collection: DOCUMENT_NAME }
);

module.exports = mongoose.model(DOCUMENT_NAME, VideoSchema);
