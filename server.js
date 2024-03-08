require('dotenv').config()
const express = require("express")
const mongoose = require("mongoose")
const app = express()
const cors = require('cors')
const appApi = require("./routes/api")
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json')
const fileUpload = require('express-fileupload')
const cloudinary = require('cloudinary').v2

const host = process.env.DATABASE

mongoose
  .connect(host)
  .then(() => console.log('Connected to DB'))
  .catch(err => console.log(err))


//body parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(fileUpload())
app.use(cors())

// swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
// API
app.use("/api", appApi)
// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
  secure: true
});


app.listen(process.env.PORT, () => {
  console.log(`Server is running on ${process.env.PORT}`)
})