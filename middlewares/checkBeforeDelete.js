const Product = require('../models/product.model');
const { BadRequestError } = require('../response/error.response');
const asyncHandler = require('../utils/async-handler');

module.exports = (fieldName) => {
  return asyncHandler(async (req, res, next) => {
    const { _id } = req.params;
    const productCount = await Product.countDocuments({
      [fieldName]: _id,
    });
    if (productCount > 0) {
      throw new BadRequestError(
        `Cannot delete. ${productCount} product(s) are associated with this ${fieldName}`
      );
    }
    next();
  });
};
