// middlewares/checkAssociation.js
const Product = require('../models/product.model');
const { BadResquestError } = require('../response/error.response');

// Generalized middleware to check associations
module.exports = (fieldName) => {
  return async (req, res, next) => {
    const { _id } = req.params; // Assuming the entity ID is passed as `id` in the route
    const productCount = await Product.countDocuments({
      [fieldName]: _id,
    });
    if (productCount > 0) {
      return res.status(400).json({
        status: 'failed',
        message: `Không thể xoá !. ${productCount} sản phẩm đang liên quan tới ${fieldName}`,
      });
    }
    next(); // Proceed to the next middleware or route handler
  };
};
