const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BoardgameSchema = new Schema({
  bgg_id: { type: String, required: true },
  title: { type: String, required: true },
  photo_url: { type: String, required: true },
  description: { type: String, required: true },
});

module.exports = mongoose.model("Boardgame", BoardgameSchema);
