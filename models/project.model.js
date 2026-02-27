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

ProjectSchema.pre('save', function () {
  if (this.isModified('project_title')) {
    this.project_slug = slugName(this.project_title);
  }
});

ProjectSchema.pre('findOneAndUpdate', async function () {
  const update = this.getUpdate();
  if (update.project_title) {
    update.project_slug = slugName(update.project_title);
  }
});
module.exports = mongoose.model(DOCUMENT_NAME, ProjectSchema);
