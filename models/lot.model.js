const mongoose = require('mongoose');
const DOCUMENT_NAME = 'Lot';
const COLLECTION_NAME = 'Lots';

const LotSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    lot_code: { type: String, required: true, trim: true },
    lot_quantity: { type: Number, required: true, default: 0, min: 0 },
    lot_purchase_price: { type: Number, required: true, default: 0, min: 0 },
    lot_selling_price: { type: Number, required: true, default: 0, min: 0 },
    lot_note: { type: String, default: '' },
  },
  { timestamps: true, collection: COLLECTION_NAME }
);

LotSchema.index({ product: 1, lot_code: 1 }, { unique: true });
LotSchema.index({ product: 1 });

LotSchema.pre(/^find/, function () {
  if (this.getOptions().skipPopulate) return;
  this.populate({
    path: 'product',
    select: 'product_name product_slug product_cover_image brand category',
  });
});

module.exports = mongoose.model(DOCUMENT_NAME, LotSchema);
