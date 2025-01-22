const express = require('express');
const projectController = require('../controllers/projects.controller');
const upload = require('../middlewares/upload');
const resize = require('../middlewares/resize');
const router = express.Router();

router.get('/', projectController.getAllProjects);
router.post(
  '/',
  upload.single('project_thumbnail'),
  resize('projects'),
  projectController.createProject
);

router.get('/:_id', projectController.getProjectById);
router.get('/slug/:slug', projectController.getProjectBySlug);
router.put('/:_id', projectController.updateProject);
router.delete('/:_id', projectController.deleteProject);

module.exports = router;
