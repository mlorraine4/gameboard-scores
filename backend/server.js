const express = require("express");
const app = express();
const port = 3000;

require("dotenv").config();

// Mongoose connection
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const mongoDB = process.env.MONGO_URI;

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

app.get("/", (req, res) => {
  res.send("Hello World from Node.js server!");
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
