const express = require('express');
const Counter = require('../models/visitor-counter.model');
const asyncHandler = require('../utils/async-handler');
const router = express.Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const counter = await Counter.findOne();
    return res.status(200).json({
      status: 'success',
      metadata: counter ? counter.visitors : 0,
    });
  })
);

module.exports = router;
