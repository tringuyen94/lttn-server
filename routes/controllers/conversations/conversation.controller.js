const { query } = require("express")
const Conversation = require("../../../models/conversation.model")

const createConversation = ({
  phoneNumber,
  socketId,
  textChat,
  jointAt,
  isConnected,
}) => {
  let newConversation = new Conversation({
    phoneNumber,
    socketId,
    contents: textChat,
    jointAt,
    isConnected,
  })
  return newConversation.save()
}
const updateConversation = ({ socketId, content }) => {
  Conversation.updateOne(
    { socketId: socketId },
    { $push: { contents: content } },
    function (err, res) {
      if (err) throw err
      return res
    }
  )
}
const getConversationBySocketId = (adminNSP, socketId) => {
  let query = Conversation.findOne({ socketId: socketId })
  query.exec(function (err, res) {
    if (err) throw err
    return adminNSP.emit("conversation-by-id", res.contents)
  })
}
const updateStatus = ({ socketId }) => {
  Conversation.updateOne(
    { socketId: socketId },
    { $set: { isConnected: false } },
    function (err, res) {
      if (err) throw err
      return res
    }
  )
}
const deleteConversation = (socketIdDelete) => {
  let query = Conversation.deleteOne({ socketId: socketIdDelete })
  query.exec(function (err, res) {
    if (err) throw err
    return res
  })
}
const getConversations = (adminNSP) => {
  let query = Conversation.find({})
  query.exec(function (err, res) {
    if (err) throw err
    return adminNSP.emit("get-conversations", res)
  })
}
module.exports = {
  createConversation,
  getConversations,
  getConversationBySocketId,
  deleteConversation,
  updateConversation,
  updateStatus,
}
