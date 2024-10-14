const mongoose = require('mongoose');
const slugName = require('../utils/slug-name');
const DOCUMENT_NAME = 'Project';
const COLLECTION_NAME = 'Projects';

const ProjectSchema = new mongoose.Schema(
  {
    project_title: { type: String, required: true, unique: true },
    project_slug: { type: String },
    project_thumbnail: { type: String },
    project_content: { type: String },
  },
  { timestamps: true, collection: COLLECTION_NAME }
);

ProjectSchema.pre('save', function (next) {
  if (this.isModified('project_title')) {
    this.project_slug = slugName(this.project_title);
  }
  next();
});
ProjectSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate();
  if (update.project_title) {
    update.project_slug = slugName(update.project_title);
  }
  next();
});
module.exports = mongoose.model(DOCUMENT_NAME, ProjectSchema);
