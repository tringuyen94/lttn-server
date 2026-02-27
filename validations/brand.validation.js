const Joi = require('joi');

const baseBrandSchema = {
  brand_name: Joi.string().trim().min(1).max(255),
};

const createBrandSchema = Joi.object({
  ...baseBrandSchema,
  brand_name: baseBrandSchema.brand_name.required(),
});

const updateBrandSchema = Joi.object(baseBrandSchema).min(1);

module.exports = {
  createBrandSchema,
  updateBrandSchema,
};

