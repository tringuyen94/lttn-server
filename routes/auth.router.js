const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authentication } = require('../middlewares/auth.middlewares');
const { validateRequest } = require('../middlewares/validate-request');
const {
  signupSchema,
  signinSchema,
  changePasswordSchema,
} = require('../validations/auth.validation');

router.get('/me', authentication, authController.checkLogged);
router.post('/signup', validateRequest(signupSchema), authController.signup);
router.post('/signin', validateRequest(signinSchema), authController.signin);
router.get('/signout', authentication, authController.signout);
router.patch(
  '/change-password',
  authentication,
  validateRequest(changePasswordSchema),
  authController.changePassword
);

module.exports = router;
