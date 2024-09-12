const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Notification = require("./notification");

const FriendRequestSchema = new Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

Notification.discriminator("FriendRequest", FriendRequestSchema);
module.exports = mongoose.model("FriendRequest");
