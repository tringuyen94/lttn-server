const express = require('express');
const productControllers = require('../controllers/products.controllers');
const router = express.Router();
const upload = require('../middlewares/upload');
const resize = require('../middlewares/resize');
const { IMAGE_LIMIT } = require('../constant');

router.get('/', productControllers.getAllProducts);
router.post(
  '/',
  upload.array('product_images', IMAGE_LIMIT.product),
  resize('products'),
  productControllers.createProduct
);

router.get('/:_id', productControllers.getProductById);
router.delete('/:_id', productControllers.deleteProduct);
router.patch('/:_id', productControllers.updateProduct);

module.exports = router;
