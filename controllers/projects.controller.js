const Factory = require('../factory');
const Project = require('../models/project.model');
const asyncHandler = require('../utils/async-handler');

const getAllProjects = new Factory(Project).getAll;
const getProjectById = new Factory(Project).getOne;
const createProject = new Factory(Project).create;
const updateProject = new Factory(Project).update;
const deleteProject = new Factory(Project).delete;

const getProjectBySlug = asyncHandler(async (req, res, next) => {
  const project = await Project.findOne({ project_slug: req.params.slug });
  if (!project) throw new NotFoundError('Không tìm thấy', 404);
  return res.status(200).json({
    message: 'success',
    metadata: project,
  });
});

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getProjectBySlug,
};
