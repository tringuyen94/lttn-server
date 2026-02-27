const express = require('express');
const brandControllers = require('../controllers/brands.controller');
const {
  authentication,
  authorization,
} = require('../middlewares/auth.middlewares');
const checkBeforeDelete = require('../middlewares/checkBeforeDelete');
const { validateRequest } = require('../middlewares/validate-request');
const {
  createBrandSchema,
  updateBrandSchema,
} = require('../validations/brand.validation');
const router = express.Router();

router.get('/', brandControllers.getBrands);
router.post(
  '/',
  authentication,
  authorization('admin', 'moderator'),
  validateRequest(createBrandSchema),
  brandControllers.createBrand
);
router.patch(
  '/:_id',
  authentication,
  authorization('admin', 'moderator'),
  validateRequest(updateBrandSchema),
  brandControllers.updateBrand
);
router.delete(
  '/:_id',
  authentication,
  authorization('admin', 'moderator'),
  checkBeforeDelete('brand'),
  brandControllers.deleteBrand
);

module.exports = router;
