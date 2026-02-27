const sharp = require('sharp');
const crypto = require('crypto');
const { IMAGE_CONFIG } = require('../constant');

const uniqueName = () => crypto.randomUUID();

const processImage = async (fileBuffer, outputPath) => {
  await sharp(fileBuffer)
    .toFormat('webp')
    .webp({ quality: IMAGE_CONFIG.quality })
    .toFile(`./public/${outputPath}`);
};

const processThumbnail = async (fileBuffer, outputPath) => {
  const dir = outputPath.substring(0, outputPath.lastIndexOf('/'));
  const base = outputPath.substring(outputPath.lastIndexOf('/') + 1);
  const thumbPath = `${dir}/thumb-${base}`;

  await sharp(fileBuffer)
    .resize(IMAGE_CONFIG.thumbnailWidth)
    .toFormat('webp')
    .webp({ quality: IMAGE_CONFIG.thumbnailQuality })
    .toFile(`./public/${thumbPath}`);
};

const processWithThumbnail = async (fileBuffer, outputPath) => {
  await Promise.all([
    processImage(fileBuffer, outputPath),
    processThumbnail(fileBuffer, outputPath),
  ]);
};

module.exports = (type) => {
  return async (req, res, next) => {
    try {
      switch (type) {
        case 'products': {
          const tasks = [];

          if (req.files?.product_cover_image) {
            const filename = `images/products/cover-${uniqueName()}.webp`;
            req.body.product_cover_image = filename;
            tasks.push(
              processWithThumbnail(
                req.files.product_cover_image[0].buffer,
                filename
              )
            );
          }

          if (req.files?.product_images) {
            req.body.product_images = [];
            for (const img of req.files.product_images) {
              const filename = `images/products/product-${uniqueName()}.webp`;
              req.body.product_images.push(filename);
              tasks.push(processWithThumbnail(img.buffer, filename));
            }
          }

          await Promise.all(tasks);
          break;
        }

        case 'projects': {
          if (req.file) {
            const filename = `images/projects/project-${uniqueName()}.webp`;
            req.body.project_thumbnail = filename;
            await processWithThumbnail(req.file.buffer, filename);
          }
          break;
        }

        case 'category_image': {
          if (req.file) {
            const filename = `images/categories/category-${uniqueName()}.webp`;
            req.body.category_image = filename;
            await processWithThumbnail(req.file.buffer, filename);
          }
          break;
        }

        default:
          break;
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
