// Create a schema for the user's data and export model

const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  email: String,
  password: String,
  name: String,
  bioHead: String,
  bioText: String,
  liked: Array,
  disliked: Array,
  hasNewMessages: Boolean
})

module.exports = mongoose.model("users", UserSchema);
