const express = require('express');
const videoController = require('../controllers/video.controller');
const router = express.Router();

router.get('/getURL', videoController.fetchVideoURL);
router.post('/updateURL', videoController.updateVideoURL);

module.exports = router;
