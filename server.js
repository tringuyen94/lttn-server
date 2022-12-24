require('dotenv').config()
const express = require("express")
const mongoose = require("mongoose")
const app = express()
const cors = require('cors')
const appApi = require("./routes/api")
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json')
const fileUpload = require('express-fileupload')
const cloudinary = require('cloudinary')

const host = process.env.DATABASE
mongoose
  .connect(host, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
  }, () => console.log('Connected to database'))


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
  api_secret: process.env.CLOUD_API_SECRET
});


app.listen(process.env.PORT, () => {
  console.log(`Server is running on ${process.env.PORT}`)
})