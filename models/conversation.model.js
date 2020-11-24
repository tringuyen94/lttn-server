const mongoose = require("mongoose")

const ConversationSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true },
  socketId: { type: String, required: true },
  contents: { type: Array },
  jointAt: { type: Date, required: true },
  isConnected: { type: Boolean, require: true },
})
const Conversation = mongoose.model(
  "Conversation",
  ConversationSchema,
  "Conversation"
)
module.exports = Conversation
