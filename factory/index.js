const { CREATED, SuccessResponse } = require('../response/success.response');
const { NotFoundError } = require('../response/error.response');
const asyncHandler = require('../utils/async-handler');
const { cleanupDocumentImages } = require('../utils/cleanup-images');
const { IMAGE_FIELDS } = require('../constant');

class Factory {
  constructor(model) {
    this.model = model;
  }

  create = asyncHandler(async (req, res, next) => {
    const doc = await this.model.create(req.body);
    new CREATED({
      res,
      message: 'Created successfully',
      metadata: doc,
    });
  });

  getAll = asyncHandler(async (req, res, next) => {
    const docs = await this.model.find().select('-__v');
    new SuccessResponse({
      metadata: docs,
      res,
    });
  });

  delete = asyncHandler(async (req, res, next) => {
    const doc = await this.model.findById(req.params);
    if (!doc) throw new NotFoundError('Not found', 404);

    const modelName = this.model.modelName;
    const fields = IMAGE_FIELDS[modelName] || [];
    if (fields.length) {
      await cleanupDocumentImages(doc, fields);
    }

    await this.model.findByIdAndDelete(req.params);
    return res.status(204).json({
      status: 'success',
    });
  });

  update = asyncHandler(async (req, res, next) => {
    const modelName = this.model.modelName;
    const fields = IMAGE_FIELDS[modelName] || [];
    const imageFieldsInBody = fields.filter((f) => req.body[f]);

    let oldDoc = null;
    if (imageFieldsInBody.length) {
      oldDoc = await this.model.findById(req.params).lean();
    }

    const updatedOne = await this.model.findByIdAndUpdate(
      req.params,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedOne) throw new NotFoundError('Not found', 404);

    if (oldDoc) {
      cleanupDocumentImages(oldDoc, imageFieldsInBody).catch(() => {});
    }

    new SuccessResponse({
      metadata: updatedOne,
      res,
    });
  });

  getOne = asyncHandler(async (req, res, next) => {
    const doc = await this.model.findById(req.params);
    if (!doc) throw new NotFoundError('Not found', 404);
    new SuccessResponse({
      res,
      metadata: doc,
    });
  });
}
module.exports = Factory;
