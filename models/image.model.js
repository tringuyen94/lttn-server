const mongoose = require("mongoose")

const ImageSchema = new mongoose.Schema({
  path: { type: String, required: true }
})

const Image = mongoose.model("Image", ImageSchema, "Image")

module.exports = {
  ImageSchema,
  Image
}
