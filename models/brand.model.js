const mongoose = require("mongoose")
const BrandSchema = new mongoose.Schema({
  nameBrand: { type: String, required: true },
  slug: { type: String, required: true }
})
const Brand = mongoose.model("Brand", BrandSchema, "Brand")
module.exports = Brand