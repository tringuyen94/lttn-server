const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authentication } = require('../middlewares/auth.middlewares');

router.post('/signup', authController.signup);
router.post('/signin', authController.signin);
router.get('/signout', authentication, authController.signout);
router.get('/', authentication, authController.checkLogged);
router.patch('/change-password', authentication, authController.changePassword);

module.exports = router;
