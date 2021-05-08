const mongoose = require("mongoose")

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: mongoose.Schema.Types.ObjectId, ref: "Image" },
  detail: { type: String },
  capacity: { type: String },
  brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand", required: true },
  isNewOne: { type: Boolean },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
})

const Product = mongoose.model("Product", ProductSchema, "Product")
module.exports = {
  ProductSchema,
  Product,
}
