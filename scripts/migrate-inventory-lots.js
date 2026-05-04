/**
 * Migrate legacy Inventory schema (with embedded quantity/prices) to lot-based model.
 *
 * For each Inventory:
 *   - If legacy fields exist with quantity > 0, create a Lot { lot_code: 'MIGRATED', ... } using the old data.
 *   - Strip legacy fields (inventory_quantity, inventory_purchase_price, inventory_selling_price) from Inventory doc.
 * For each StockTransaction with old `transaction_lot` string:
 *   - Try to match a Lot by (product, lot_code). Set tx.lot = lot._id, tx.lot_code = matched lot_code.
 *   - If no match, set tx.lot_code = transaction_lot (preserve as snapshot), tx.lot = null.
 *   - Unset legacy `transaction_lot` field.
 *
 * Idempotent: re-running is safe.
 *
 * Usage: node scripts/migrate-inventory-lots.js
 */

const mongoose = require('mongoose');
const Inventory = require('../models/inventory.model');
const Lot = require('../models/lot.model');
const StockTransaction = require('../models/stock-transaction.model');

const DB_URI = process.env.DB_URI || 'mongodb://127.0.0.1:27017/lttn-db';

async function migrate() {
  await mongoose.connect(DB_URI);
  console.log('[migrate] connected to', DB_URI);

  const inventoriesCol = mongoose.connection.collection('Inventories');
  const stockTxCol = mongoose.connection.collection('StockTransactions');

  // === Step 1: Migrate Inventory legacy fields → Lot ===
  const legacyInventories = await inventoriesCol
    .find({ inventory_quantity: { $exists: true } })
    .toArray();

  console.log(`[migrate] found ${legacyInventories.length} legacy inventories`);

  let lotsCreated = 0;
  for (const inv of legacyInventories) {
    const qty = inv.inventory_quantity || 0;
    if (qty > 0) {
      const existing = await Lot.findOne({ product: inv.product, lot_code: 'MIGRATED' })
        .setOptions({ skipPopulate: true });
      if (!existing) {
        await Lot.create({
          product: inv.product,
          lot_code: 'MIGRATED',
          lot_quantity: qty,
          lot_purchase_price: inv.inventory_purchase_price || 0,
          lot_selling_price: inv.inventory_selling_price || 0,
          lot_note: 'Tạo tự động khi migrate sang model lot-based',
        });
        lotsCreated++;
      }
    }

    await inventoriesCol.updateOne(
      { _id: inv._id },
      {
        $unset: {
          inventory_quantity: '',
          inventory_purchase_price: '',
          inventory_selling_price: '',
        },
      }
    );
  }
  console.log(`[migrate] created ${lotsCreated} Lots, stripped legacy fields from ${legacyInventories.length} Inventories`);

  // === Step 2: Backfill StockTransaction.lot / lot_code ===
  const legacyTxs = await stockTxCol
    .find({ transaction_lot: { $exists: true } })
    .toArray();

  console.log(`[migrate] found ${legacyTxs.length} legacy transactions`);

  let txMatched = 0;
  let txOrphan = 0;
  for (const tx of legacyTxs) {
    const lotCode = tx.transaction_lot || '';
    let lotRef = null;
    let lotCodeSnapshot = lotCode;

    if (lotCode) {
      const matched = await Lot.findOne({ product: tx.product, lot_code: lotCode })
        .setOptions({ skipPopulate: true });
      if (matched) {
        lotRef = matched._id;
        lotCodeSnapshot = matched.lot_code;
        txMatched++;
      } else {
        txOrphan++;
      }
    }

    await stockTxCol.updateOne(
      { _id: tx._id },
      {
        $set: {
          lot: lotRef,
          lot_code: lotCodeSnapshot,
        },
        $unset: { transaction_lot: '' },
      }
    );
  }
  console.log(`[migrate] backfilled transactions: ${txMatched} matched to lots, ${txOrphan} orphan (lot_code preserved as snapshot)`);

  await mongoose.disconnect();
  console.log('[migrate] done');
}

migrate().catch((err) => {
  console.error('[migrate] FAILED', err);
  process.exit(1);
});
