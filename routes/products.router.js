const express = require('express');
const productControllers = require('../controllers/products.controller');
const router = express.Router();
const upload = require('../middlewares/upload');
const resize = require('../middlewares/resize');
const { IMAGE_LIMIT_UPLOAD } = require('../constant');
const {
  authentication,
  authorization,
} = require('../middlewares/auth.middlewares');
const { validateRequest } = require('../middlewares/validate-request');
const {
  createProductSchema,
  updateProductSchema,
} = require('../validations/product.validation');

router.get('/', productControllers.getAllProducts);
router.get('/:_id', productControllers.getProductById);
router.get('/slug/:slug', productControllers.getProductBySlug);

router.post(
  '/',
  authentication,
  authorization('admin', 'moderator'),
  upload.fields([
    {
      name: 'product_cover_image',
      maxCount: 1,
    },
    { name: 'product_images', maxCount: IMAGE_LIMIT_UPLOAD.product },
  ]),
  resize('products'),
  validateRequest(createProductSchema),
  productControllers.createProduct
);

router.delete(
  '/:_id',
  authentication,
  authorization('admin', 'moderator'),
  productControllers.deleteProduct
);

router.patch(
  '/:_id',
  authentication,
  authorization('admin', 'moderator'),
  validateRequest(updateProductSchema),
  productControllers.updateProduct
);

router.patch(
  '/update-image/:_id',
  authentication,
  authorization('admin', 'moderator'),
  upload.fields([
    {
      name: 'product_cover_image',
      maxCount: 1,
    },
    { name: 'product_images', maxCount: IMAGE_LIMIT_UPLOAD.product },
  ]),
  resize('products'),
  productControllers.updateProduct
);

module.exports = router;
