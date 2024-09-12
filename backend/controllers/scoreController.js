const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const Score = require("../models/score");
const Session = require("../models/session");
const jwt = require("jsonwebtoken");

// try {
//   if (req.headers.authorization) {
//     const token = req.headers.authorization;
//     const decoded = jwt.verify(token, process.env.SECRET);
//     const user = await User.findOne({ _id: decoded.userID }).exec();

//     if (user === null) {
//       return res.sendStatus(401);
//     }
//   }
// } catch (err) {
//   return res.sendStatus(500);
// }

exports.score_list_get = asyncHandler(async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization;
      const decoded = jwt.verify(token, process.env.SECRET);
      const user = await User.findOne({ _id: decoded.userID }).exec();

      if (user === null) {
        return res.sendStatus(401);
      }

      const scoreList = await Score.find({ player: user._id }).exec();
    }
  } catch (err) {
    return res.sendStatus(500);
  }
});

exports.score_post = [
  asyncHandler(async (req, res) => {
    try {
      if (req.headers.authorization) {
        const token = req.headers.authorization;
        const decoded = jwt.verify(token, process.env.SECRET);
        const user = await User.findOne({ _id: decoded.userID }).exec();

        if (user === null) {
          return res.sendStatus(401);
        }

        const session = await Session.findById(req.body.session_id).exec();

        if (session === null) {
          return res.sendStatus(401);
        }

        let scoreIds = [];

        for (const score of req.body.scores) {
          let player =
            (await User.findOne({ username: score.player }).exec()) ||
            score.player;
          let dbScore = new Score({
            points: score.points,
            won: score.won,
            player: player,
          });

          await dbScore.save();
          scoreIds.push(dbScore._id);
        }

        session.push(scoreIds);
        await session.save();
        return res.sendStatus(200);
      }
    } catch (err) {
      return res.sendStatus(500);
    }
  }),
];

exports.score_get = asyncHandler(async (req, res) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization;
      const decoded = jwt.verify(token, process.env.SECRET);
      const user = await User.findOne({ _id: decoded.userID }).exec();

      if (user === null) {
        return res.sendStatus(401);
      }
    }
  } catch (err) {
    return res.sendStatus(500);
  }
});

exports.score_put = asyncHandler(async (req, res) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization;
      const decoded = jwt.verify(token, process.env.SECRET);
      const user = await User.findOne({ _id: decoded.userID }).exec();

      if (user === null) {
        return res.sendStatus(401);
      }

      const score = await Score.findById(req.params.id).exec();

      if (req.body.points) {
        score.points = req.body.points;
      }

      if (req.body.won) {
        score.won = req.body.won;
      }

      if (req.body.player) {
        const player = await User.findOne({ username: req.body.player }).exec();

        if (player === null) {
          return res.sendStatus(404);
        }

        score.player = player;
      }

      if (req.body.guest) {
        score.guest = req.body.guest;
      }

      await score.save();
      return res.sendStatus(200);
    }
  } catch (err) {
    return res.sendStatus(500);
  }
});

exports.score_delete = asyncHandler(async (req, res) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization;
      const decoded = jwt.verify(token, process.env.SECRET);
      const user = await User.findOne({ _id: decoded.userID }).exec();

      if (user === null) {
        return res.sendStatus(401);
      }

      await Score.findByIdAndDelete(req.params.id).exec();
      return res.sendStatus(200);
    }
  } catch (err) {
    return res.sendStatus(500);
  }
});
