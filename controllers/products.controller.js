const Product = require('../models/product.model');
const Factory = require('../factory');
const asyncHandler = require('../utils/async-handler');
const FilterFeature = require('../utils/filter-features');
const { NotFoundError } = require('../response/error.response');

const getAllProducts = asyncHandler(async (req, res, next) => {
  const filterChain = () =>
    new FilterFeature(Product.find(), req.query)
      .filterByName()
      .filterIsNew()
      .sortByCapacity()
      .filterByBrand()
      .filterByCategory();

  const features = filterChain().paginate(20);

  const [total, products] = await Promise.all([
    Product.countDocuments(filterChain().query.getFilter()),
    features.query.select('-__v -product_description').lean(),
  ]);

  return res.status(200).json({
    message: 'Success',
    result: products.length,
    metadata: {
      products,
      pagination: {
        total,
        page: features.page,
        limit: features.limit,
        totalPages: Math.ceil(total / features.limit),
      },
    },
  });
});
const getProductBySlug = asyncHandler(async (req, res, next) => {
  const product = await Product.findOne({ product_slug: req.params.slug });
  if (!product) throw new NotFoundError('Not found', 404);
  const similarProducts = await Product.find({
    _id: { $ne: product._id },
    product_capacity: product.product_capacity,
  })
    .limit(4)
    .select('-__v -product_description');

  return res.status(200).json({
    message: 'Success',
    metadata: {
      product,
      similarProducts,
    },
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
