const Joi = require('joi');

const objectId = Joi.string().hex().length(24);

const baseProductSchema = {
  product_name: Joi.string().trim().min(1).max(255),
  product_description: Joi.string().allow('', null),
  product_capacity: Joi.number().integer().min(0),
  product_isnew: Joi.boolean(),
  product_cover_image: Joi.string(),
  product_images: Joi.array().items(Joi.string()),
  brand: objectId,
  category: objectId,
};

const createProductSchema = Joi.object({
  ...baseProductSchema,
  product_name: baseProductSchema.product_name.required(),
  brand: baseProductSchema.brand.required(),
  category: baseProductSchema.category.required(),
});

const updateProductSchema = Joi.object(baseProductSchema).min(1);

module.exports = {
  createProductSchema,
  updateProductSchema,
};

