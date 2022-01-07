require('dotenv').config()
const express = require("express")
const mongoose = require("mongoose")
const app = express()
const cors = require('cors')
const appApi = require("./routes/api")

const host = process.env.DATABASE
mongoose
.connect(host, {
    useNewUrlParser: true,
    useFindAndModify:false,
    useUnifiedTopology: true,
    useCreateIndex: true,
  }, () => console.log('Connected to database'))
//body parser
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(express.json())
//serve static file
app.use("/uploads", express.static("./uploads"))

app.use("/api", appApi)


app.listen(9000, () => {
  console.log(`Server is running on 9000`)
})
