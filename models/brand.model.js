const mongoose = require("mongoose")
const BrandSchema = new mongoose.Schema({
  nameBrand: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
})
const Brand = mongoose.model("Brand", BrandSchema, "Brand")
module.exports = {
  BrandSchema,
  Brand,
}
