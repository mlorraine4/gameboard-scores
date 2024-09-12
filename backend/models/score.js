const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ScoreSchema = new Schema({
  points: { type: Number },
  won: { type: Boolean },
  player: { type: Schema.Types.ObjectId, ref: "User" },
  guest: String,
});

module.exports = mongoose.model("Score", ScoreSchema);
