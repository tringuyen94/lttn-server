const mongoose = require('mongoose')


const ProjectSchema = new mongoose.Schema({
   title: { type: String, required: true },
   slug: { type: String, required: true },
   projectThumb: [],
   content: { type: String, required: true }
}, { timestamps: true })

const Project = mongoose.model('Project', ProjectSchema, 'Project')

module.exports = Project     