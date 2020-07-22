const express = require("express")
const mongoose = require("mongoose")
const appApi = require("./routes/api")

const host = "mongodb://localhost:27017/LTTNElectric"
mongoose
  .connect(host, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connect to database successfully")
  })
  .catch(console.log)

const app = express()
//body parser
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
//serve static file
app.use("/uploads", express.static("./uploads"))
// fix CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  )
  next()
})
app.use("/api", appApi)
const port = 9000
app.listen(port, () => {
  console.log(`Server is running on ${port}`)
})
