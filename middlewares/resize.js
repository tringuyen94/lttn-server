const sharp = require('sharp');
const slugName = require('../utils/slug-name');

const processResize = async (fileBuffer, size, path) => {
  await sharp(fileBuffer)
    .resize(size.width, size.height)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(path);
};

module.exports = (type) => {
  return (req, res, next) => {
    if (!req.file && !req.files) next();
    switch (type) {
      case 'products':
        req.body.product_images = [];
        req.files.map((f, index) => {
          f.filename = `product-${slugName(req.body.product_name)}-${
            index + 1
          }.jpeg`;
          processResize(
            f.buffer,
            { width: 450, height: 600 },
            `./public/images/products-test/${f.filename}`
          );
          req.body.product_images.push(f.filename);
        });
        break;
      case 'projects':
        req.body.project_thumbnail = `project-${slugName(
          req.body.project_title
        )}.jpeg`;
        break;
      default:
        break;
    }
    next();
  };
};
