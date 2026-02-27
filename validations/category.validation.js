const Joi = require('joi');

const baseCategorySchema = {
  category_name: Joi.string().trim().min(1).max(255),
  category_image: Joi.string(),
};

const createCategorySchema = Joi.object({
  ...baseCategorySchema,
  category_name: baseCategorySchema.category_name.required(),
});

const updateCategorySchema = Joi.object(baseCategorySchema).min(1);

module.exports = {
  createCategorySchema,
  updateCategorySchema,
};

