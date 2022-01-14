const { default: slugify } = require('slugify')
const Project = require('../../../models/project.model')



const getProjects = (req, res, next) => {
   Project.find()
      .then(projects => res.status(200).json(projects))
      .catch(err => res.status(500).json(err))
}
const getProjectById = (req, res, next) => {
   Project.findOne({ _id: req.params })
      .then(project => res.status(200).json(project))
      .catch(err => res.status(500).json({ err, message: "Đã có lỗi xảy ra" }))
}
const createProject = (req, res, next) => {
   const { title, content } = req.body
   const slug = slugify(title, { lower: true })
   const projectThumb = req.file.path
   Project.findOne({ title })
      .then(project => {
         if (project) return Promise.reject({ status: 408, message: "Tiêu đề đã tồn tại rồi" })
         let _project = new Project({ title, slug, content, projectThumb })
         return _project.save()
      })
      .then(newProject => res.status(201).json(newProject))
      .catch(err => {
         if (err.status) return res.status(err.status).json(err.message)
         return res.status(500).json({ err, message: 'Đã có lỗi xảy ra' })
      })
}
const updateProjectById = (req, res, next) => {
   Project.findByIdAndUpdate(req.params, { $set: req.body }, { new: true }, function (err, result) {
      if (err) return res.status(500).json({ message: 'Cập nhật thất bại' })
      return res.status(204).json({ updated: result, message: "Cập nhật thành công" })
   })
}
const updateProjectThumb = (req, res, next) => {
   const projectThumb = req.file.path
   Project.findByIdAndUpdate(req.params, { $set: { projectThumb } }, { new: true }, function (err, result) {
      if (err) return res.status(500).json({ err, message: "Cập nhật ảnh tiêu đề thất bại" })
      return res.status(204).json({ result, message: "Cập nhật thành công" })
   })
}
const deleteProjectById = (req, res, next) => [
   Project.deleteOne({ _id: req.params })
      .then(result => {
         if (result.n === 0) return Promise.reject({ status: 404, message: "Không tìm thấy dự án" })
         return res.status(202).json({ result, message: "Đã xoá thành công" })
      })
      .catch(err => {
         if (err.status) return res.status(err.status).json(err.message)
         return res.status(500).json({ err, message: "Đã có lỗi xảy ra" })
      })
]


module.exports = { getProjects, getProjectById, createProject, updateProjectById, updateProjectThumb, deleteProjectById }