require('dotenv').config()
const express = require("express")
const mongoose = require("mongoose")
const app = express()
const cors= require('cors')
const appApi = require("./routes/api")

const host = process.env.DATABASE
mongoose
  .connect(host, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex:true
  })
  .then(() => {
    console.log("Connected to database")
  })  
  .catch(err=>console.log(err))

//body parser
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
//serve static file
app.use("/uploads", express.static("./uploads"))
app.use("/api",cors(), appApi)
app.use('/public', express.static('/public'))
const port = process.env.PORT || 9000
app.listen(port, () => {
  console.log(`Server is running on ${port}`)
})
//socket parttt
// const io = require("socket.io")(http)
// const {
//   createConversation,
//   getConversations,
//   updateConversation,
//   deleteConversation,
//   updateStatus,
//   getConversationById,
// } = require("./routes/controllers/conversations/conversation.controller")
// const adminNSP = io.of("/admin")

// adminNSP.on("connect", (adminSocket) => {
//   getConversations(adminNSP)
//   adminSocket.on("get-conversation-by-id", (c onversationId) => {
//     getConversationById(adminNSP, conversationId)
//   })
//   adminSocket.on("admin-message", (adminMessage) => {
//     adminNSP.emit("admin-message", adminMessage)
//     let content = {
//       textChat: adminMessage.textChat,
//       sentAt: adminMessage.sentAt,
//       isSentByAdmin: true,
//     }
//     io.to(adminMessage.socketId).emit("admin-message", content)
//     updateConversation({ socketId: adminMessage.socketId, content })
//   })
//   adminSocket.on("delete-conversation", (conversationId) => {
//     deleteConversation(conversationId)
//   })
// })
// io.on("connect", (socket) => {
//   socket.on("join", (client) => {
//     socket.join(socket.id)
//     let timeJoint = new Date()
//     let welcome = {
//       textChat: `Chào mừng bạn đến với LTTNElectric`,
//       sentAt: timeJoint,
//       isSentByAdmin: true,
//     }
//     io.to(socket.id).emit("welcome", welcome)
//     createConversation({
//       phoneNumber: client,
//       socketId: socket.id,
//       textChat: welcome,
//       jointAt: timeJoint,
//       isConnected: true,
//     }, adminNSP)
//   })
//   socket.on("message", (clientMessage) => {
//     let clientData = {
//       textChat: clientMessage.textChat,
//       sentAt: clientMessage.sentAt,
//       isSentByAdmin: false,
//     }
//     adminNSP.emit("client-message", clientData)
//     io.to(clientMessage.socketId).emit("client-message", clientData)
//     updateConversation({ socketId: socket.id, content: clientData })
//   })
//   socket.on("disconnect", () => {
//     updateStatus({ socketId: socket.id }, adminNSP)
//     socket.leave(socket.id)
//   })
// })
