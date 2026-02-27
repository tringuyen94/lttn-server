const Joi = require('joi');

const updateVideoSchema = Joi.object({
  video_url: Joi.string().uri().required(),
});

module.exports = {
  updateVideoSchema,
};

