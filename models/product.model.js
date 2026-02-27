const mongoose = require('mongoose');
const slugName = require('../utils/slug-name');
const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';

const ProductSchema = new mongoose.Schema(
  {
    product_name: { type: String, required: true, unique: true },
    product_slug: { type: String },
    product_images: [String],
    product_cover_image: { type: String },
    product_description: { type: String },
    product_capacity: { type: Number },
    product_isnew: { type: Boolean },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brand',
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
  },
  { timestamps: true, collection: COLLECTION_NAME }
);
ProductSchema.index({ product_slug: 1 });
ProductSchema.index({ createdAt: 1 });
ProductSchema.index({ product_capacity: 1 });
ProductSchema.index({ brand: 1 });
ProductSchema.index({ category: 1 });
ProductSchema.pre('save', function () {
  if (this.isModified('product_name')) {
    this.product_slug = slugName(this.product_name);
  }
});
ProductSchema.pre(/^find/, function () {
  this.populate({ path: 'brand', select: 'brand_name brand_slug' }).populate({
    path: 'category',
    select: 'category_name category_slug',
  });
});
ProductSchema.pre('findOneAndUpdate', async function () {
  const update = this.getUpdate();
  if (update.product_name) {
    update.product_slug = slugName(update.product_name);
  }
});

module.exports = mongoose.model(DOCUMENT_NAME, ProductSchema);
