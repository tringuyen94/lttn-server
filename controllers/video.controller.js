const Video = require('../models/video.model');
const asyncHandler = require('../utils/async-handler');
const { NotFoundError } = require('../response/error.response');

const fetchVideoURL = asyncHandler(async (req, res) => {
  const videos = await Video.find();
  return res.status(200).json(videos);
});

const updateVideoURL = asyncHandler(async (req, res) => {
  const video = await Video.findOne();
  if (!video) throw new NotFoundError('No video record found');
  const updated = await Video.findByIdAndUpdate(
    video._id,
    { $set: req.body },
    { new: true }
  );
  return res.status(200).json({ updated, message: 'Updated successfully' });
});

module.exports = { updateVideoURL, fetchVideoURL };
