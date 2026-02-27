const fs = require('fs/promises');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');

/**
 * Safely delete a single image file (original + thumbnail if exists).
 * Silently ignores files that no longer exist on disk.
 */
const deleteImageFile = async (relativePath) => {
  if (!relativePath) return;

  const fullPath = path.join(PUBLIC_DIR, relativePath);
  await fs.unlink(fullPath).catch(() => {});

  // Also remove the thumbnail variant (e.g. images/products/thumb-xxx.webp)
  const dir = path.dirname(relativePath);
  const base = path.basename(relativePath);
  const thumbPath = path.join(PUBLIC_DIR, dir, `thumb-${base}`);
  await fs.unlink(thumbPath).catch(() => {});
};

/**
 * Delete all image files referenced by a document.
 * @param {Object} doc - Mongoose document
 * @param {string[]} imageFields - Field names that contain image paths
 */
const cleanupDocumentImages = async (doc, imageFields = []) => {
  const promises = [];
  for (const field of imageFields) {
    const value = doc[field];
    if (Array.isArray(value)) {
      for (const imgPath of value) {
        promises.push(deleteImageFile(imgPath));
      }
    } else if (typeof value === 'string') {
      promises.push(deleteImageFile(value));
    }
  }
  await Promise.all(promises);
};

module.exports = { deleteImageFile, cleanupDocumentImages };
