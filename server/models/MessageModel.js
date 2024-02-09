// Create a schema for the message's data and export model

const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema({
  group: Array,
  log: Array
})

// Log array format: [{sender: sender group index, text: message content}]

module.exports = mongoose.model("Messages", MessageSchema);
