const express = require('express');
const inventoryController = require('../controllers/inventory.controller');
const { authentication, authorization } = require('../middlewares/auth.middlewares');
const { validateRequest } = require('../middlewares/validate-request');
const {
  createInventorySchema,
  updateInventorySchema,
  stockTransactionSchema,
} = require('../validations/inventory.validation');

const router = express.Router();

router.use(authentication, authorization('admin', 'moderator'));

router.get('/', inventoryController.getAllInventory);
router.get('/product/:productId', inventoryController.getInventoryByProduct);
router.get('/product/:productId/lots', inventoryController.getInventoryLots);
router.get('/transactions', inventoryController.getTransactions);

router.post(
  '/',
  validateRequest(createInventorySchema),
  inventoryController.createInventory
);

router.post(
  '/transaction',
  validateRequest(stockTransactionSchema),
  inventoryController.processTransaction
);

router.patch(
  '/:_id',
  validateRequest(updateInventorySchema),
  inventoryController.updateInventory
);

router.delete('/:_id', inventoryController.deleteInventory);

module.exports = router;
