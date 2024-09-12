const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SessionSchema = new Schema({
  game_id: { String },
  scores: [{ type: Schema.Types.ObjectId, ref: "Score" }],
  date: { type: Date, required: true },
});

module.exports = mongoose.model("Session", SessionSchema);
