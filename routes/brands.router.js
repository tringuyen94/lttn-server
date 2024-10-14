const express = require('express');
const brandControllers = require('../controllers/brands.controllers');
const router = express.Router();

router.get('/', brandControllers.getBrands);
router.post('/', brandControllers.createBrand);
router.patch('/:_id', brandControllers.updateBrand);
router.delete('/:_id', brandControllers.deleteBrand);

module.exports = router;
