const express = require('express');
const Counter = require('../models/visitor-counter.model');
const router = express.Router();

router.get('/', async (req, res, next) => {
  let c = await Counter.findOne();
  return res.status(200).json({
    status: 'success',
    metadata: c.visitors,
  });
});
module.exports = router;
