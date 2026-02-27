const express = require('express');
const categoriesController = require('../controllers/categories.controller');
const router = express.Router();
const upload = require('../middlewares/upload');
const resize = require('../middlewares/resize');
const {
  authentication,
  authorization,
} = require('../middlewares/auth.middlewares');
const checkBeforeDelete = require('../middlewares/checkBeforeDelete');
const { validateRequest } = require('../middlewares/validate-request');
const {
  createCategorySchema,
  updateCategorySchema,
} = require('../validations/category.validation');

router.get('/', categoriesController.getCategories);
router.post(
  '/',
  authentication,
  authorization('admin', 'moderator'),
  upload.single('category_image'),
  resize('category_image'),
  validateRequest(createCategorySchema),
  categoriesController.createCategory
);
router.patch(
  '/:_id',
  authentication,
  authorization('admin', 'moderator'),
  upload.single('category_image'),
  resize('category_image'),
  validateRequest(updateCategorySchema),
  categoriesController.updateCategory
);
router.delete(
  '/:_id',
  authentication,
  authorization('admin', 'moderator'),
  checkBeforeDelete('category'),
  categoriesController.deleteCategory
);

module.exports = router;
