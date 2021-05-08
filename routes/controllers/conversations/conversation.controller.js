const Conversation = require("../../../models/conversation.model")

const createConversation = ({
  phoneNumber,
  socketId,
  textChat,
  jointAt,
  isConnected,
}, adminNSP) => {
  let newConversation = new Conversation({
    phoneNumber,
    socketId,
    contents: textChat,
    jointAt,
    isConnected,
  })
  newConversation.save()
  return adminNSP.emit('client-joint', newConversation)
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
const getConversationById = (adminNSP, conversationId) => {
  Conversation.findById(conversationId)
    .exec(function (err, res) {
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
const deleteConversation = (conversationId) => {
  Conversation.deleteOne({ _id: conversationId }).exec(function (err, res) {
    if (err) throw err
    return res
  })
}
const getConversations = (adminNSP) => {
  Conversation.find().exec(function (err, res) {
    if (err) throw err
    return adminNSP.emit("get-conversations", res)
  })
}
module.exports = {
  createConversation,
  getConversations,
  getConversationById,
  deleteConversation,
  updateConversation,
  updateStatus,
}
