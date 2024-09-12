const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  photo_url: String,
  status: String,
  friends: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
  boardgames: [
    { type: Schema.Types.ObjectId, ref: "Boardgame", required: true },
  ],
  favorite_boardgames: [
    { type: Schema.Types.ObjectId, ref: "Boardgame", required: true },
  ],
  notifications: [
    { type: Schema.Types.ObjectId, ref: "Notification", required: true },
  ],
});

UserSchema.index({ username: "text" });

module.exports = mongoose.model("User", UserSchema);
