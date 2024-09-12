const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
  date: { type: Date, required: true },
  seen: { type: Boolean, required: true },
});

module.exports = mongoose.model("Notification", NotificationSchema);
