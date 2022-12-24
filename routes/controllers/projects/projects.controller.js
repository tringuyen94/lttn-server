const { default: slugify } = require('slugify')
const Project = require('../../../models/project.model')
const cloudinary = require('cloudinary')


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
const createProject = async (req, res, next) => {
   let imageLinks = []
   try {
      const result = await cloudinary.v2.uploader.upload(req.body.projectThumb, { folder: "lttn-electric/projects" })
      imageLinks.push({
         public_id: result.public_id,
         url: result.secure_url
      })
      req.body.projectThumb = imageLinks

   } catch (err) {
      return res.status(500).json({ err, message: "Đã xảy ra lỗi" })
   }
   const slug = slugify(req.body.title, { lower: true })
   let project = await Project.findOne({ title: req.body.title })
   if (project) return res.status(500).json({ message: "Tên sản phẩm đã tồn tại" })
   let newProj = await Project.create({ ...req.body, slug })
   return res.status(201).json({ newProj, message: `Thêm ${req.body.title} thành công` })
}
const updateProjectById = async (req, res, next) => {
   // Remove undefined key-value on req.body
   Object.keys(req.body).forEach(key => {
      if (req.body[key] === 'undefined' || req.body[key] === '') {
         delete req.body[key]
      }
   })
   let project = await Project.findById(req.params._id)
   try {
      if (req.body.projectThumb) {
         for (let image of project.projectThumb) {
            await cloudinary.v2.uploader.destroy(image.public_id)
         }
         let imageLinks = []
         const result = await cloudinary.v2.uploader.upload(req.body.projectThumb, { folder: "lttn-electric/projects" })
         imageLinks.push({
            public_id: result.public_id,
            url: result.secure_url
         })
         req.body.projectThumb = imageLinks
      }
   } catch (err) {
      return res.status(500).json({ err, message: "Đã xảy ra lỗi" })
   }
   Project.findByIdAndUpdate(req.params._id, req.body, { new: true, runValidators: true }, function (err, result) {
      console.log(err)

      if (err) return res.status(500).json({ err, message: "Cập nhật thất bại" })
      return res.status(200).json({ updated: result, message: "Cập nhật thành công" })
   })
}

const deleteProjectById = async (req, res, next) => {
   //Find project
   let project = await Project.findById(req.params._id)
   // If not found project
   if (!project) return res.status(404).json({ message: "Xoá thất bại" })
   //Delete Images On Cloudinarys
   for (let image of project.projectThumb) {
      await cloudinary.v2.uploader.destroy(image.public_id)
   }
   //Remove project from data
   await project.remove()

   return res.status(200).json({ message: ` Xoá ${project.title} thành công` })
}


module.exports = {
   getProjects, getProjectById,
   createProject, updateProjectById,
   deleteProjectById
}