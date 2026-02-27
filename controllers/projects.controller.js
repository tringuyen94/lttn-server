const Factory = require('../factory');
const Project = require('../models/project.model');
const asyncHandler = require('../utils/async-handler');
const { NotFoundError } = require('../response/error.response');

const getAllProjects = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit) || 9, 1), 100);
  const skip = (page - 1) * limit;

  const total = await Project.countDocuments();
  const projects = await Project.find()
    .select('-__v -project_content')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return res.status(200).json({
    message: 'Success',
    metadata: {
      projects,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    },
  });
});

const getProjectBySlug = asyncHandler(async (req, res) => {
  const project = await Project.findOne({ project_slug: req.params.slug });
  if (!project) throw new NotFoundError('Not found', 404);

  const relatedProjects = await Project.find({
    _id: { $ne: project._id },
  })
    .select('-__v -project_content')
    .sort({ createdAt: -1 })
    .limit(3);

  return res.status(200).json({
    message: 'Success',
    metadata: { project, relatedProjects },
  });
});

const getProjectById = new Factory(Project).getOne;
const createProject = new Factory(Project).create;
const updateProject = new Factory(Project).update;
const deleteProject = new Factory(Project).delete;

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getProjectBySlug,
};
