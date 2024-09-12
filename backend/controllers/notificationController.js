// 1. POST Add Notification (send notification to recipient)
// 2. GET See notification
// 3. DELETE Delete Notification
// 4. PUT Update notification (mark as seen)
const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const Notification = require("../models/notification");
const jwt = require("jsonwebtoken");

exports.notification_list = asyncHandler(async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization;
      const decoded = jwt.verify(token, process.env.SECRET);
      const user = await User.findOne({ _id: decoded.user_id })
        .populate("notifications")
        .exec();

      if (user === null) {
        return res.sendStatus(401);
      }

      return res.status(200).send({
        notifications: user.notifications,
      });
    } else {
      // Unauthorized user
      return res.sendStatus(401);
    }
  } catch (err) {
    return res.sendStatus(500);
  }
});

exports.notification_put = asyncHandler(async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization;
      const decoded = jwt.verify(token, process.env.SECRET);
      const user = await User.findById(decoded.user_id).exec();

      if (user === null) {
        return res.sendStatus(401);
      }

      const isAuthorized = user.notification.some((notification) => {
        return notification.equals(req.params.id);
      });

      if (!isAuthorized) {
        return res.sendStatus(404);
      }

      const notification = await Notification.findById(req.params.id).exec();

      if (notification === null) {
        return res.sendStatus(404);
      }

      notification.seen = req.body.seen;
      await notification.save();

      return res.status(200).send({
        notification: notification,
      });
    } else {
      // Unauthorized user
      return res.sendStatus(401);
    }
  } catch (err) {
    return res.sendStatus(500);
  }
});

exports.notification_delete = asyncHandler(async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization;
      const decoded = jwt.verify(token, process.env.SECRET);
      const user = await User.findById(decoded.user_id).exec();

      if (user === null) {
        return res.sendStatus(401);
      }

      const isAuthorized = user.notification.some((notification) => {
        return notification.equals(req.params.id);
      });

      if (!isAuthorized) {
        return res.sendStatus(404);
      }

      const notification = await Notification.findById(req.params.id).exec();

      if (notification === null) {
        return res.sendStatus(404);
      }

      const result = await Notification.deleteOne({
        _id: req.params.id,
      }).exec();

      return res.status(200).send({
        result: result,
      });
    } else {
      // Unauthorized user
      return res.sendStatus(401);
    }
  } catch (err) {
    return res.sendStatus(err);
  }
});
