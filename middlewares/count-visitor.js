const Counter = require('../models/visitor-counter.model');

module.exports = async (req, res, next) => {
  try {
    await Counter.updateOne(
      {},
      { $inc: { visitors: 1 } },
      { upsert: true }
    );
  } catch (err) {
    // Don't block the request if visitor counting fails
  }
  next();
};
