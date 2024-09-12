const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const Score = require("../models/score");
const Session = require("../models/session");
const jwt = require("jsonwebtoken");

// TODO: sort by game, sort by date (descending and ascending)
exports.session_list_get = asyncHandler(async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization;
      const decoded = jwt.verify(token, process.env.SECRET);
      const user = await User.findOne({ _id: decoded.userID }).exec();

      if (user === null) {
        return res.sendStatus(401);
      }

      const scores = await Score.find({ player: user._id }).exec();

      const sessions = await Session.find({
        scores: { $in: scores },
      })
        .populate({
          path: "scores",
          populate: { path: "player", select: "username photo_url _id" },
        })
        .exec();

      return res.status(200).send({ sessions: sessions });
    }

    return res.sendStatus(401);
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
});

exports.session_get = asyncHandler(async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization;
      const decoded = jwt.verify(token, process.env.SECRET);
      const user = await User.findOne({ _id: decoded.userID }).exec();

      if (user === null) {
        return res.sendStatus(401);
      }

      const session = await Session.findById(req.params.id)
        .populate("scores")
        .populate("user")
        .exec();

      return res.status(200).send({ session: session });
    } else {
      return res.sendStatus(401);
    }
  } catch (err) {
    return res.sendStatus(500);
  }
});

// TODO: rewrite to add each score sent with one request
exports.session_post = [
  asyncHandler(async (req, res, next) => {
    try {
      if (req.headers.authorization) {
        const token = req.headers.authorization;
        const decoded = jwt.verify(token, process.env.SECRET);
        const user = await User.findOne({ _id: decoded.userID }).exec();

        if (user === null) {
          return res.sendStatus(401);
        }

        // for each score of req.body.scores

        let score = new Score({
          points: 102,
          won: false,
          player: user._id,
        });

        await score.save();

        let session = new Session({
          date: Date.now(),
          game_id: 35424,
          scores: [score._id],
        });

        await session.save();

        console.log(score);
        return res.sendStatus(200);
      }
      // Unauthorized user
      return res.sendStatus(401);
    } catch (err) {
      console.log(err);
      return res.sendStatus(500);
    }
  }),
];

exports.session_put = [
  asyncHandler(async (req, res, next) => {
    try {
      if (req.headers.authorization) {
        const token = req.headers.authorization;
        const decoded = jwt.verify(token, process.env.SECRET);
        const user = await User.findOne({ _id: decoded.userID }).exec();

        if (user === null) {
          return res.sendStatus(401);
        }

        const session = await Session.findById(req.params.id).exec();

        if (session === null) {
          return res.sendStatus(404);
        }

        session.game_id = req.body.gameId;
        await session.save();
        return res.sendStatus(200);

        // update game
        // update scores separately in score controller
        // each score will have its own form that calls update
      }
      return res.sendStatus(401);
    } catch (err) {}
  }),
];

exports.session_delete = asyncHandler(async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization;
      const decoded = jwt.verify(token, process.env.SECRET);
      const user = await User.findOne({ _id: decoded.userID }).exec();

      if (user === null) {
        return res.sendStatus(401);
      }

      const session = await Session.findById(req.params.id)
        .populate("scores")
        .exec();

      if (session === null) {
        return res.sendStatus(404);
      }

      // Checks if user is included in player array for game session
      const isAuthorized = (el) => el.player === user._id;

      if (!session.scores.some(isAuthorized)) {
        // User is not authorized
        return res.sendStatus(401);
      }

      // Delete session
      await Session.findByIdAndDelete(req.params.id).exec();
      return res.sendStatus(200);
    }
    // Unauthorized user
    return res.sendStatus(401);
  } catch (err) {
    return res.sendStatus(500);
  }
});
