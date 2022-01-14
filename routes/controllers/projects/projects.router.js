const express = require('express')
const projectController = require('./projects.controller')
const uploadImage = require('../../../middlewares/uploadimage.middleware')

const router = express.Router()


router.get('/get-projects', projectController.getProjects)
router.get('/get-project-by-id/:_id',projectController.getProjectById)


router.post('/create-project', uploadImage('projectThumb'), projectController.createProject)
router.put('/update-project-by-id/:_id', projectController.updateProjectById)
router.put('/update-project-thumb/:_id',uploadImage('projectThumb'), projectController.updateProjectThumb)

router.delete('/delete-project-by-id/:_id', projectController.deleteProjectById)


module.exports = router