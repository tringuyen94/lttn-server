const mongoose = require('mongoose');
const DOCUMENT_NAME = 'StockTransaction';
const COLLECTION_NAME = 'StockTransactions';

const StockTransactionSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    lot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lot',
      default: null,
    },
    lot_code: { type: String, default: '', trim: true },
    transaction_type: {
      type: String,
      enum: ['stock_in', 'stock_out'],
      required: true,
    },
    transaction_quantity: { type: Number, required: true, min: 1 },
    transaction_purchase_price: { type: Number, default: 0, min: 0 },
    transaction_selling_price: { type: Number, default: 0, min: 0 },
    transaction_note: { type: String, default: '' },
  },
  { timestamps: true, collection: COLLECTION_NAME }
);

StockTransactionSchema.index({ product: 1 });
StockTransactionSchema.index({ lot: 1 });
StockTransactionSchema.index({ createdAt: -1 });

StockTransactionSchema.pre(/^find/, function () {
  if (this.getOptions().skipPopulate) return;
  this.populate({
    path: 'product',
    select: 'product_name product_slug product_cover_image',
  });
});

module.exports = mongoose.model(DOCUMENT_NAME, StockTransactionSchema);
