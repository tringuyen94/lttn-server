const express = require("express")
const mongoose = require("mongoose")
const { disconnect } = require("process")
const app = express()
const appApi = require("./routes/api")
const http = require("http").createServer(app)

const host = "mongodb://localhost:27017/LTTNElectric"
mongoose
  .connect(host, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connect to database successfully")
  })
  .catch(console.log)

//body parser
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
//serve static file
app.use("/uploads", express.static("./uploads"))
// fix CORS
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  )
  next()
})
app.use("/api", appApi)
const port = 9000
http.listen(port, () => {
  console.log(`Server is running on ${port}`)
})
//socket parttt
const io = require("socket.io")(http)
const {
  createConversation,
  getConversations,
  updateConversation,
  deleteConversation,
  updateStatus,
  getConversationBySocketId,
} = require("./routes/controllers/conversations/conversation.controller")
const adminNSP = io.of("/admin")

adminNSP.on("connect", (adminSocket) => {
  getConversations(adminNSP)
  adminSocket.on("get-conversation-by-socketid", (socketId) => {
    getConversationBySocketId(adminNSP, socketId)
  })
  adminSocket.on("admin-message", (adminMessage) => {
    adminNSP.emit("admin-message", adminMessage)
    let content = {
      textChat: adminMessage.textChat,
      sentAt: adminMessage.sentAt,
      isSentByAdmin: true,
    }
    io.to(adminMessage.socketId).emit("admin-message", content)
    updateConversation({ socketId: adminMessage.socketId, content })
  })
  adminSocket.on("delete-conversation", (deleteSocketId) => {
    deleteConversation(deleteSocketId)
  })
})
io.on("connect", (socket) => {
  socket.on("join", (client) => {
    socket.join(socket.id)
    let timeJoint = new Date()
    adminNSP.emit("client-joint", {
      socketId: socket.id,
      phoneNumber: client,
      jointAt: timeJoint,
      isConnected: true,
    })
    let welcome = {
      textChat: `Hi ! ${client}`,
      sentAt: timeJoint,
      isSentByAdmin: true,
    }
    io.to(socket.id).emit("welcome", welcome)
    createConversation({
      phoneNumber: client,
      socketId: socket.id,
      textChat: welcome,
      jointAt: timeJoint,
      isConnected: true,
    })
  })
  socket.on("message", (clientMessage) => {
    let clientData = {
      textChat: clientMessage.textChat,
      sentAt: clientMessage.sentAt,
      isSentByAdmin: false,
    }
    adminNSP.emit("client-message", clientData)
    io.to(clientMessage.socketId).emit("client-message", clientData)
    updateConversation({ socketId: socket.id, content: clientData })
  })

  socket.on("disconnect", () => {
    updateStatus({ socketId: socket.id })
    socket.leave(socket.id)
  })
})
