const mongoose = require('mongoose');
const slugName = require('../utils/slug-name');

const DOCUMENT_NAME = 'Category';
const COLLECTION_NAME = 'Categories';

const CategorySchema = new mongoose.Schema(
  {
    category_name: { type: String, required: true, unique: true },
    category_image: String,
    category_slug: String,
  },
  { collection: COLLECTION_NAME }
);
CategorySchema.pre('save', function () {
  if (this.isModified('category_name')) {
    this.category_slug = slugName(this.category_name);
  }
});
CategorySchema.pre('findOneAndUpdate', async function () {
  const update = this.getUpdate();
  if (update.category_name) {
    update.category_slug = slugName(update.category_name);
  }
});

module.exports = mongoose.model(DOCUMENT_NAME, CategorySchema);
