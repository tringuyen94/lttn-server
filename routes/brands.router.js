const express = require('express');
const brandControllers = require('../controllers/brands.controllers');
const {
  authentication,
  authorization,
} = require('../middlewares/auth.middlewares');
const checkBeforeDelete = require('../middlewares/checkBeforeDelete');
const router = express.Router();

router.get('/', brandControllers.getBrands);
router.post(
  '/',
  authentication,
  authorization('admin', 'moderator'),
  brandControllers.createBrand
);
router.delete(
  '/:_id',
  authentication,
  authorization('admin', 'moderator'),
  checkBeforeDelete('brand'),
  brandControllers.deleteBrand
);

module.exports = router;
