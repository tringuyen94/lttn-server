const mongoose = require('mongoose');
const slugify = require('slugify');
const slugName = require('../utils/slug-name');

const DOCUMENT_NAME = 'Category';
const COLLECTION_NAME = 'Categories';

const CategorySchema = new mongoose.Schema(
  {
    category_name: { type: String, required: true, unique: true },
    category_slug: { type: String },
  },
  { collection: COLLECTION_NAME }
);
CategorySchema.pre('save', function (next) {
  if (this.isModified('category_name')) {
    this.category_slug = slugName(this.category_name);
  }
  next();
});
CategorySchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate();
  if (update.category_name) {
    update.category_slug = slugName(update.category_name);
  }
  next();
});

module.exports = mongoose.model(DOCUMENT_NAME, CategorySchema);
