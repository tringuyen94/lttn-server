const mongoose = require('mongoose')

const VideoSchema = new mongoose.Schema({
   videoUrl: { type: String, required: true }
})

const Video = mongoose.model('Video', VideoSchema, 'Video')

module.exports = Video