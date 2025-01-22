const mongoose = require('mongoose');
const slugify = require('slugify');
const slugName = require('../utils/slug-name');

const DOCUMENT_NAME = 'Brand';
const COLLECTION_NAME = 'Brands';

const BrandSchema = new mongoose.Schema(
  {
    brand_name: { type: String, required: true, unique: true },
    brand_slug: { type: String },
  },
  { collection: COLLECTION_NAME }
);
BrandSchema.pre('save', function (next) {
  if (this.isModified('brand_name')) {
    this.brand_name = this.brand_name.toUpperCase();
    this.brand_slug = slugName(this.brand_name);
  }
  next();
});
BrandSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate();
  if (update.brand_name) {
    update.brand_name = update.brand_name.toUpperCase();
    update.brand_slug = slugName(update.brand_name);
  }
  next();
});

module.exports = mongoose.model(DOCUMENT_NAME, BrandSchema);
