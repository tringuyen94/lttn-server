const Product = require('../models/product.model');
const Factory = require('../factory');
const asyncHandler = require('../utils/async-handler');
const FilterFeature = require('../utils/filter-features');

const getAllProducts = asyncHandler(async (req, res, next) => {
  const features = new FilterFeature(Product.find(), req.query)
    .filterByName()
    .filterIsNew()
    .sortByCapacity()
    .filterByBrand()
    .filterByCategory();
  const products = await features.query.select('-__v -product_description');

  return res.status(200).json({
    message: 'Success',
    result: products.length,
    metadata: products,
  });
});
const getProductBySlug = asyncHandler(async (req, res, next) => {
  const doc = await Product.findOne({ product_slug: req.params.slug });
  if (!doc) throw new NotFoundError('Không tìm thấy', 404);
  return res.status(200).json({
    message: 'Success',
    metadata: doc,
  });
});

const createProduct = new Factory(Product).create;
const getProductById = new Factory(Product).getOne;
const updateProduct = new Factory(Product).update;
const deleteProduct = new Factory(Product).delete;

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductBySlug,
};
