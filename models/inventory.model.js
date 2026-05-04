const mongoose = require('mongoose');
const DOCUMENT_NAME = 'Inventory';
const COLLECTION_NAME = 'Inventories';

const InventorySchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    inventory_note: { type: String, default: '' },
  },
  { timestamps: true, collection: COLLECTION_NAME }
);

InventorySchema.index({ product: 1 }, { unique: true });

InventorySchema.pre(/^find/, function () {
  if (this.getOptions().skipPopulate) return;
  this.populate({
    path: 'product',
    select: 'product_name product_slug product_cover_image brand category',
  });
});

module.exports = mongoose.model(DOCUMENT_NAME, InventorySchema);
