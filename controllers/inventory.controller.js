const Inventory = require('../models/inventory.model');
const Lot = require('../models/lot.model');
const StockTransaction = require('../models/stock-transaction.model');
const asyncHandler = require('../utils/async-handler');
const { SuccessResponse, CREATED } = require('../response/success.response');
const { NotFoundError, BadRequestError } = require('../response/error.response');

const groupLotsByProduct = (lots) => {
  return lots.reduce((map, lot) => {
    const pid = (lot.product?._id || lot.product).toString();
    if (!map[pid]) map[pid] = [];
    map[pid].push(lot);
    return map;
  }, {});
};

const getAllInventory = asyncHandler(async (req, res) => {
  const inventories = await Inventory.find().sort({ updatedAt: -1 }).lean();

  const productIds = inventories
    .map((i) => i.product?._id || i.product)
    .filter(Boolean);

  const lots = await Lot.find({ product: { $in: productIds } })
    .setOptions({ skipPopulate: true })
    .sort({ createdAt: 1 })
    .lean();

  const lotsByProduct = groupLotsByProduct(lots);

  const result = inventories.map((inv) => {
    const pid = (inv.product?._id || inv.product)?.toString();
    const productLots = lotsByProduct[pid] || [];
    return {
      ...inv,
      lots: productLots,
      total_quantity: productLots.reduce((s, l) => s + l.lot_quantity, 0),
    };
  });

  new SuccessResponse({ metadata: result, res });
});

const getInventoryByProduct = asyncHandler(async (req, res) => {
  const inventory = await Inventory.findOne({ product: req.params.productId }).lean();
  if (!inventory) throw new NotFoundError('Không tìm thấy tồn kho cho sản phẩm này');

  const lots = await Lot.find({ product: req.params.productId })
    .setOptions({ skipPopulate: true })
    .sort({ createdAt: 1 })
    .lean();

  inventory.lots = lots;
  inventory.total_quantity = lots.reduce((s, l) => s + l.lot_quantity, 0);

  new SuccessResponse({ metadata: inventory, res });
});

const getInventoryLots = asyncHandler(async (req, res) => {
  const lots = await Lot.find({ product: req.params.productId })
    .setOptions({ skipPopulate: true })
    .sort({ createdAt: 1 })
    .lean();
  new SuccessResponse({ metadata: lots, res });
});

const createInventory = asyncHandler(async (req, res) => {
  const { product, inventory_note, initial_lot } = req.body;

  const existing = await Inventory.findOne({ product });
  if (existing) throw new BadRequestError('Sản phẩm đã có trong kho');

  let inventory = await Inventory.create({ product, inventory_note });

  let createdLot = null;
  if (initial_lot) {
    try {
      createdLot = await Lot.create({
        product,
        lot_code: initial_lot.lot_code,
        lot_quantity: initial_lot.lot_quantity,
        lot_purchase_price: initial_lot.lot_purchase_price,
        lot_selling_price: initial_lot.lot_selling_price,
        lot_note: initial_lot.lot_note || '',
      });
    } catch (err) {
      try {
        await Inventory.deleteOne({ _id: inventory._id });
      } catch (rollbackErr) {
        console.error(
          '[inventory] CRITICAL: rollback inventory create failed',
          { id: inventory._id, originalError: err?.message, rollbackError: rollbackErr?.message }
        );
      }
      throw err;
    }

    try {
      await StockTransaction.create({
        product,
        lot: createdLot._id,
        lot_code: createdLot.lot_code,
        transaction_type: 'stock_in',
        transaction_quantity: createdLot.lot_quantity,
        transaction_purchase_price: createdLot.lot_purchase_price,
        transaction_selling_price: createdLot.lot_selling_price,
        transaction_note: 'Khởi tạo kho',
      });
    } catch (err) {
      try {
        await Lot.deleteOne({ _id: createdLot._id });
        await Inventory.deleteOne({ _id: inventory._id });
      } catch (rollbackErr) {
        console.error(
          '[inventory] CRITICAL: rollback lot+inventory create failed',
          { lotId: createdLot._id, inventoryId: inventory._id, originalError: err?.message, rollbackError: rollbackErr?.message }
        );
      }
      throw err;
    }
  }

  inventory = await Inventory.findById(inventory._id).lean();
  const lots = await Lot.find({ product })
    .setOptions({ skipPopulate: true })
    .sort({ createdAt: 1 })
    .lean();
  inventory.lots = lots;
  inventory.total_quantity = lots.reduce((s, l) => s + l.lot_quantity, 0);

  new CREATED({ res, message: 'Đã thêm sản phẩm vào kho', metadata: inventory });
});

const updateInventory = asyncHandler(async (req, res) => {
  const inventory = await Inventory.findByIdAndUpdate(req.params._id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!inventory) throw new NotFoundError('Không tìm thấy tồn kho');
  new SuccessResponse({ metadata: inventory, res });
});

const deleteInventory = asyncHandler(async (req, res) => {
  const inventory = await Inventory.findByIdAndDelete(req.params._id).setOptions({ skipPopulate: true });
  if (!inventory) throw new NotFoundError('Không tìm thấy tồn kho');
  if (inventory.product) {
    await Lot.deleteMany({ product: inventory.product });
    await StockTransaction.deleteMany({ product: inventory.product });
  }
  return res.status(204).json({ status: 'success' });
});

const handleStockIn = async ({ product, lot_code, transaction_quantity, lot_purchase_price, lot_selling_price, transaction_note }) => {
  const inventoryExists = await Inventory.exists({ product });
  if (!inventoryExists) throw new NotFoundError('Sản phẩm chưa có trong kho');

  let lot = await Lot.findOne({ product, lot_code }).setOptions({ skipPopulate: true });
  let isNewLot = false;

  if (lot) {
    lot = await Lot.findOneAndUpdate(
      { _id: lot._id },
      { $inc: { lot_quantity: transaction_quantity } },
      { new: true }
    ).setOptions({ skipPopulate: true });
  } else {
    if (lot_purchase_price === undefined || lot_selling_price === undefined) {
      throw new BadRequestError('Lô mới phải có giá mua vào và giá bán ra');
    }
    isNewLot = true;
    lot = await Lot.create({
      product,
      lot_code,
      lot_quantity: transaction_quantity,
      lot_purchase_price,
      lot_selling_price,
    });
  }

  let transaction;
  try {
    transaction = await StockTransaction.create({
      product,
      lot: lot._id,
      lot_code: lot.lot_code,
      transaction_type: 'stock_in',
      transaction_quantity,
      transaction_purchase_price: lot.lot_purchase_price,
      transaction_selling_price: lot.lot_selling_price,
      transaction_note,
    });
  } catch (err) {
    try {
      if (isNewLot) {
        await Lot.deleteOne({ _id: lot._id });
      } else {
        await Lot.updateOne(
          { _id: lot._id },
          { $inc: { lot_quantity: -transaction_quantity } }
        );
      }
    } catch (rollbackErr) {
      console.error(
        '[inventory] CRITICAL: stock_in rollback failed',
        { lotId: lot._id, isNewLot, originalError: err?.message, rollbackError: rollbackErr?.message }
      );
    }
    throw err;
  }

  return { lot, transaction };
};

const handleStockOut = async ({ lot: lotId, transaction_quantity, transaction_note }) => {
  const lot = await Lot.findOneAndUpdate(
    { _id: lotId, lot_quantity: { $gte: transaction_quantity } },
    { $inc: { lot_quantity: -transaction_quantity } },
    { new: true }
  ).setOptions({ skipPopulate: true });

  if (!lot) {
    const exists = await Lot.exists({ _id: lotId });
    if (!exists) throw new NotFoundError('Không tìm thấy lô');
    throw new BadRequestError('Số lượng xuất kho vượt quá tồn kho hiện tại');
  }

  let transaction;
  try {
    transaction = await StockTransaction.create({
      product: lot.product,
      lot: lot._id,
      lot_code: lot.lot_code,
      transaction_type: 'stock_out',
      transaction_quantity,
      transaction_purchase_price: lot.lot_purchase_price,
      transaction_selling_price: lot.lot_selling_price,
      transaction_note,
    });
  } catch (err) {
    try {
      await Lot.updateOne(
        { _id: lot._id },
        { $inc: { lot_quantity: transaction_quantity } }
      );
    } catch (rollbackErr) {
      console.error(
        '[inventory] CRITICAL: stock_out rollback failed',
        { lotId: lot._id, originalError: err?.message, rollbackError: rollbackErr?.message }
      );
    }
    throw err;
  }

  return { lot, transaction };
};

const processTransaction = asyncHandler(async (req, res) => {
  const { transaction_type } = req.body;

  let result;
  if (transaction_type === 'stock_in') {
    result = await handleStockIn(req.body);
  } else {
    result = await handleStockOut(req.body);
  }

  new CREATED({
    res,
    message: transaction_type === 'stock_in' ? 'Nhập kho thành công' : 'Xuất kho thành công',
    metadata: result,
  });
});

const getTransactions = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.product) filter.product = req.query.product;
  if (req.query.lot) filter.lot = req.query.lot;
  if (req.query.type) filter.transaction_type = req.query.type;

  const transactions = await StockTransaction.find(filter)
    .select('-__v')
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();

  new SuccessResponse({ metadata: transactions, res });
});

module.exports = {
  getAllInventory,
  getInventoryByProduct,
  getInventoryLots,
  createInventory,
  updateInventory,
  deleteInventory,
  processTransaction,
  getTransactions,
};
