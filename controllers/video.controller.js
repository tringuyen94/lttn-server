const Video = require('../models/video.model');

const fetchVideoURL = (req, res, next) => {
  Video.find()
    .then((url) => res.status(200).json(url))
    .catch((err) => res.status(500).json(err));
};
const updateVideoURL = (req, res, next) => {
  const videoId = '63a0b3681d156370501d5a4a';
  Video.findByIdAndUpdate(videoId, { $set: req.body }, { new: true })
    .then((result) =>
      res.status(200).json({ updated: result, message: 'Cập nhật thành công' })
    )
    .catch((err) =>
      res.status(500).json({ err, message: 'Cập nhật thất bại' })
    );
};

module.exports = { updateVideoURL, fetchVideoURL };
