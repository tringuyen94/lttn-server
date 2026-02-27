const express = require('express');
const projectController = require('../controllers/projects.controller');
const upload = require('../middlewares/upload');
const resize = require('../middlewares/resize');
const {
  authentication,
  authorization,
} = require('../middlewares/auth.middlewares');
const { validateRequest } = require('../middlewares/validate-request');
const {
  createProjectSchema,
  updateProjectSchema,
} = require('../validations/project.validation');
const router = express.Router();

router.get('/', projectController.getAllProjects);
router.get('/:_id', projectController.getProjectById);
router.get('/slug/:slug', projectController.getProjectBySlug);

router.post(
  '/',
  authentication,
  authorization('admin', 'moderator'),
  upload.single('project_thumbnail'),
  resize('projects'),
  validateRequest(createProjectSchema),
  projectController.createProject
);
router.put(
  '/:_id',
  authentication,
  authorization('admin', 'moderator'),
  validateRequest(updateProjectSchema),
  projectController.updateProject
);
router.delete(
  '/:_id',
  authentication,
  authorization('admin', 'moderator'),
  projectController.deleteProject
);

module.exports = router;
