const Factory = require('../factory');
const Project = require('../models/project.model');
const asyncHandler = require('../utils/async-handler');

const getAllProjects = new Factory(Project).getAll;
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
};
