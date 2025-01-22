const Counter = require('../models/visitor-counter.model');

module.exports = async (req, res, next) => {
  let counter = await Counter.findOne();
  counter.visitors += 1; // Tăng số lượt truy cập
  await counter.save(); // Lưu lại số lượt truy cập vào MongoDB
  next();
};
