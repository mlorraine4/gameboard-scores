const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const router = require("./routes/gameboardscores");
const userRouter = require("./routes/user");
const sessionRouter = require("./routes/session");
const boardgameRouter = require("./routes/boardgame");
const scoreRouter = require("./routes/score");
require("dotenv").config();

// Mongoose connection
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const mongoDB = process.env.MONGO_URI;

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

// Set headers
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  next();
});

// Routers
app.use("/", router);
app.use("/user-api", userRouter);
app.use("/session-api", sessionRouter);
app.use("/score-api", scoreRouter);
app.use("/boardgame-api", boardgameRouter);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
