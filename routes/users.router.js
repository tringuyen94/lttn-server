const express = require('express');
const userControllers = require('../controllers/users.controller');
const {
  authentication,
  authorization,
} = require('../middlewares/auth.middlewares');

const router = express.Router();

router.get(
  '/',
  authentication,
  authorization('admin', 'moderator'),
  userControllers.getAllUsers
);

module.exports = router;
