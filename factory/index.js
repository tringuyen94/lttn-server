const { CREATED, SuccessResponse } = require('../response/success.response');
const { NotFoundError } = require('../response/error.response');
const asyncHandler = require('../utils/async-handler');

class Factory {
  constructor(model) {
    this.model = model;
  }
  create = asyncHandler(async (req, res, next) => {
    const doc = await this.model.create(req.body);
    new CREATED({
      res,
      message: 'Thêm thành công',
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
    if (!doc) throw new NotFoundError('Không tìm thấy', 404);
    await this.model.findByIdAndDelete(req.params);
    return res.status(204).json({
      status: 'success',
    });
  });
  update = asyncHandler(async (req, res, next) => {
    const updatedOne = await this.model.findByIdAndUpdate(
      req.params,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedOne) throw new NotFoundError('Không tìm thấy', 404);
    new SuccessResponse({
      metadata: updatedOne,
      res,
    });
  });
  getOne = asyncHandler(async (req, res, next) => {
    const doc = await this.model.findById(req.params);
    if (!doc) throw new NotFoundError('Không tìm thấy', 404);

    new SuccessResponse({
      res,
      metadata: doc,
    });
  });
}
module.exports = Factory;
