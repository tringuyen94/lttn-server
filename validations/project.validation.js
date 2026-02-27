const Joi = require('joi');

const baseProjectSchema = {
  project_title: Joi.string().trim().min(1).max(255),
  project_thumbnail: Joi.string(),
  project_content: Joi.string().allow('', null),
};

const createProjectSchema = Joi.object({
  ...baseProjectSchema,
  project_title: baseProjectSchema.project_title.required(),
});

const updateProjectSchema = Joi.object(baseProjectSchema).min(1);

module.exports = {
  createProjectSchema,
  updateProjectSchema,
};

