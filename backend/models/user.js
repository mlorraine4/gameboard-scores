const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  photo_url: String,
  status: String,
  friends: [],
  favorite_boardgames: [],
  notifications: [],
});

module.exports = mongoose.model("User", userSchema);
