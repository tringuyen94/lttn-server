const express = require('express')
const projectController = require('./projects.controller')

const router = express.Router()


router.get('/get-projects', projectController.getProjects)
router.get('/get-project-by-id/:_id', projectController.getProjectById)


router.post('/create-project', projectController.createProject)
router.put('/update-project-by-id/:_id', projectController.updateProjectById)

router.delete('/delete-project-by-id/:_id', projectController.deleteProjectById)


module.exports = router