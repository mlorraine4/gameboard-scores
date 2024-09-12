const mongoose = require("mongoose");
const Notification = require("./notification");

const GameInviteSchema = new Schema({
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Session",
    required: true,
  },
});

Notification.discriminator("GameInvite", GameInviteSchema);
module.exports = mongoose.model("GameInvite");
