const express = require('express');
const categoriesController = require('../controllers/categories.controllers');
const router = express.Router();
const upload = require('../middlewares/upload');
const resize = require('../middlewares/resize');
const {
  authentication,
  authorization,
} = require('../middlewares/auth.middlewares');
const checkBeforeDelete = require('../middlewares/checkBeforeDelete');

router.get('/', categoriesController.getCategories);
router.post(
  '/',
  authentication,
  authorization('admin', 'moderator'),
  upload.single('category_image'),
  resize('category_image'),
  categoriesController.createCategory
);

router.delete(
  '/:_id',
  authentication,
  authorization('admin', 'moderator'),
  checkBeforeDelete('category'),
  categoriesController.deleteCategory
);

module.exports = router;
