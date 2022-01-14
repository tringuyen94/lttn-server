const mongoose = require("mongoose")

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: {type:String,required:true},
  productImages: [],
  detail: { type: String },
  capacity: { type: String },
  isNewProduct: { type: Boolean },
  brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand", required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
},{timestamps:true})

const Product = mongoose.model("Product", ProductSchema, "Product")


module.exports = Product
