const mongoose = require("mongoose")
const BrandSchema = new mongoose.Schema({
  nameBrand: { type: String, required: true },
  slugc: { type: String, required: true }
})
const Brand = mongoose.model("Brand", BrandSchema, "Brand")
module.exports = Brand