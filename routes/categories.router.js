const express = require('express');
const categoriesController = require('../controllers/categories.controllers');
const router = express.Router();

router.get('/', categoriesController.getCategories);
router.post('/', categoriesController.createCategory);
router.patch('/:_id', categoriesController.updateCategory);
router.delete('/:_id', categoriesController.deleteCategory);

module.exports = router;
