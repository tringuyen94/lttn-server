const sharp = require('sharp');
const slugName = require('../utils/slug-name');

const processResize = async (fileBuffer, path) => {
  await sharp(fileBuffer)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`./public/${path}`);
};

module.exports = (type) => {
  return (req, res, next) => {
    switch (type) {
      case 'products':
        if (req.files.product_cover_image) {
          req.body.product_cover_image = `images/products/product-cover-${Date.now()}.jpeg`;
          processResize(
            req.files.product_cover_image[0].buffer,
            req.body.product_cover_image
          );
        }
        if (req.files.product_images) {
          req.body.product_images = [];
          req.files.product_images.map((img, index) => {
            let filename = `images/products/product-${Date.now()}-${
              index + 1
            }.jpeg`;
            processResize(img.buffer, filename);
            req.body.product_images.push(filename);
          });
        }

        break;

      case 'projects':
        req.body.project_thumbnail = `images/projects/project-${Date.now()}`;
        processResize(req.file.buffer, req.body.project_thumbnail);
        break;
      case 'category_image':
        if (req.file) {
          req.body.category_image = `images/categories/category-${Date.now()}.jpeg`;

          processResize(req.file.buffer, req.body.category_image);
        }
        break;
      default:
        break;
    }
    next();
  };
};
