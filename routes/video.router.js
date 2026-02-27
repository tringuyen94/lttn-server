const express = require('express');
const videoController = require('../controllers/video.controller');
const { validateRequest } = require('../middlewares/validate-request');
const { updateVideoSchema } = require('../validations/video.validation');
const {
  authentication,
  authorization,
} = require('../middlewares/auth.middlewares');
const router = express.Router();

router.get('/getURL', videoController.fetchVideoURL);
router.post(
  '/updateURL',
  authentication,
  authorization('admin', 'moderator'),
  validateRequest(updateVideoSchema),
  videoController.updateVideoURL
);

module.exports = router;
