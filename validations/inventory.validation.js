const Joi = require('joi');

const objectId = Joi.string().hex().length(24);

const initialLotSchema = Joi.object({
  lot_code: Joi.string().trim().required().messages({
    'any.required': 'Vui lòng nhập số lô',
    'string.empty': 'Vui lòng nhập số lô',
  }),
  lot_quantity: Joi.number().integer().min(1).required().messages({
    'any.required': 'Vui lòng nhập số lượng lô',
    'number.base': 'Số lượng phải là số',
    'number.integer': 'Số lượng phải là số nguyên',
    'number.min': 'Số lượng phải >= 1',
  }),
  lot_purchase_price: Joi.number().min(0).required().messages({
    'any.required': 'Vui lòng nhập giá mua vào',
    'number.base': 'Mua vào phải là số',
    'number.min': 'Mua vào phải >= 0',
  }),
  lot_selling_price: Joi.number().min(0).required().messages({
    'any.required': 'Vui lòng nhập giá bán ra',
    'number.base': 'Bán ra phải là số',
    'number.min': 'Bán ra phải >= 0',
  }),
  lot_note: Joi.string().allow('', null),
});

const createInventorySchema = Joi.object({
  product: objectId.required().messages({
    'any.required': 'Vui lòng chọn sản phẩm',
    'string.empty': 'Vui lòng chọn sản phẩm',
    'string.hex': 'Sản phẩm không hợp lệ',
    'string.length': 'Sản phẩm không hợp lệ',
  }),
  inventory_note: Joi.string().allow('', null),
  initial_lot: initialLotSchema.required().messages({
    'any.required': 'Vui lòng tạo lô đầu tiên',
  }),
});

const updateInventorySchema = Joi.object({
  inventory_note: Joi.string().allow('', null),
}).min(1).messages({
  'object.min': 'Vui lòng cung cấp ít nhất một trường để cập nhật',
});

const stockInSchema = Joi.object({
  transaction_type: Joi.string().valid('stock_in').required(),
  product: objectId.required().messages({
    'any.required': 'Vui lòng chọn sản phẩm',
    'string.hex': 'Sản phẩm không hợp lệ',
    'string.length': 'Sản phẩm không hợp lệ',
  }),
  lot_code: Joi.string().trim().required().messages({
    'any.required': 'Vui lòng nhập số lô',
    'string.empty': 'Vui lòng nhập số lô',
  }),
  transaction_quantity: Joi.number().integer().min(1).required().messages({
    'any.required': 'Vui lòng nhập số lượng',
    'number.base': 'Số lượng phải là số',
    'number.integer': 'Số lượng phải là số nguyên',
    'number.min': 'Số lượng phải >= 1',
  }),
  lot_purchase_price: Joi.number().min(0).messages({
    'number.base': 'Mua vào phải là số',
    'number.min': 'Mua vào phải >= 0',
  }),
  lot_selling_price: Joi.number().min(0).messages({
    'number.base': 'Bán ra phải là số',
    'number.min': 'Bán ra phải >= 0',
  }),
  transaction_note: Joi.string().allow('', null),
});

const stockOutSchema = Joi.object({
  transaction_type: Joi.string().valid('stock_out').required(),
  lot: objectId.required().messages({
    'any.required': 'Vui lòng chọn lô để xuất',
    'string.hex': 'Lô không hợp lệ',
    'string.length': 'Lô không hợp lệ',
  }),
  transaction_quantity: Joi.number().integer().min(1).required().messages({
    'any.required': 'Vui lòng nhập số lượng',
    'number.base': 'Số lượng phải là số',
    'number.integer': 'Số lượng phải là số nguyên',
    'number.min': 'Số lượng phải >= 1',
  }),
  transaction_note: Joi.string().allow('', null),
});

const stockTransactionSchema = Joi.alternatives()
  .conditional('.transaction_type', {
    is: 'stock_in',
    then: stockInSchema,
    otherwise: stockOutSchema,
  });

module.exports = {
  createInventorySchema,
  updateInventorySchema,
  stockTransactionSchema,
};
