const mongoose = require("mongoose")

const CategorySchema = new mongoose.Schema({
  nameCategory: { type: String, required: true }
})

const Category = mongoose.model("Category", CategorySchema, "Category")
module.exports = Category