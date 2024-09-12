// Login, signup, logout, update account info
const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const FriendRequest = require("../models/friend-request");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.user_get = asyncHandler(async (req, res) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization;
      const decoded = jwt.verify(token, process.env.SECRET);
      const user = await User.findById(decoded.user_id, "-password").exec();

      if (user === null) {
        return res.sendStatus(401);
      }

      return res.status(200).send({ user: user });
    }
  } catch (err) {
    return res.sendStatus(500);
  }
});

// TODO: updating username and password
exports.user_put;

exports.sign_up = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    if (user) {
      return res.status(409).send({ msg: "User already exists." });
    }

    const encryptedPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = new User({
      username: req.body.username,
      password: encryptedPassword,
      photo_url: "",
      status: "",
      friends: [],
      favorite_boardgames: [],
      notifications: [],
    });

    // Save new user to db
    const result = await newUser.save();
    console.log(result);
    return res.sendStatus(201);
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
});

exports.login = asyncHandler(async (req, res, next) => {
  console.log(req.headers.authorization);
  try {
    const user = await User.findOne({ username: req.body.username });
    // User found
    if (user) {
      const isAuth = await bcrypt.compare(req.body.password, user.password);
      // User exists, password is correct. Create and pass JSON Web Token
      if (isAuth) {
        const token = jwt.sign(
          { username: user.username, user_id: user._id },
          process.env.SECRET,
          { expiresIn: "7d" }
        );
        return res.status(200).send({
          token: token,
          expiresIn: 604800,
        });
        // Invalid username/password.
      } else {
        return res
          .status(401)
          .send({ msg: "Username or Password is not correct." });
      }
      // User does not exist
    } else {
      return res.status(401).send({ msg: "User not found." });
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ msg: "An error occured authenticating user." });
  }
});

exports.friend_list = asyncHandler(async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization;
      const decoded = jwt.verify(token, process.env.SECRET);
      const user = await User.findById(decoded.user_id).exec();

      if (user === null) {
        return res.sendStatus(401);
      }

      const friends = await User.find(
        {
          _id: { $in: user.friends },
          friends: user._id,
        },
        "username photo_url"
      ).exec();

      console.log(friends);

      return res
        .status(200)
        .send({ friends: friends, friendIds: user.friends });
    } else {
      // Unauthorized user
      return res.sendStatus(401);
    }
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
});

exports.friend_put = asyncHandler(async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization;
      const decoded = jwt.verify(token, process.env.SECRET);
      const user = await User.findById(decoded.user_id).exec();

      if (user === null) {
        return res.sendStatus(401);
      }

      const recipient = await User.findOne({
        username: req.params.username,
      }).exec();

      if (recipient === null) {
        return res.sendStatus(404);
      }

      // TODO: don't think equals is right
      // Check if current user is part of recipient's friends array
      let hasRecievedRequest = recipient.friends.some((friend) => {
        return friend.equals(user._id);
      });
      // Check if recipient is part of current user's friends array
      let hasSentRequest = user.friends.some((friend) => {
        return friend.equals(recipient._id);
      });
      let isFriend = hasSentRequest && hasRecievedRequest;

      if (hasSentRequest && !hasRecievedRequest) {
        // Friend request already sent, send error
        return res
          .status(409)
          .send({ msg: "Friend request has already been sent" });
      }

      if (isFriend) {
        // User is already friends with recipient, send error
        return res
          .status(409)
          .send({ msg: `You are already friends with ${recipient.username}` });
      }

      // Send friend request
      user.friends.push(recipient);
      await user.save();

      // Send notification to recipient
      const notification = new FriendRequest({
        date: Date.now(),
        seen: false,
        sender: user._id,
      });
      await notification.save();
      recipient.notifications.push(notification);
      await recipient.save();
      return res.sendStatus(201);
    } else {
      // Unauthorized user
      return res.sendStatus(401);
    }
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
});

exports.friend_delete = asyncHandler(async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization;
      const decoded = jwt.verify(token, process.env.SECRET);
      const user = await User.findById(decoded.user_id).exec();

      if (user === null) {
        return res.sendStatus(401);
      }

      const friend = await User.findOne({
        username: req.params.username,
      }).exec();

      // Remove friend from current user's friends list
      await User.updateOne(
        { _id: user._id },
        { $pullAll: { friends: [req.params.id] } }
      ).exec();

      // Remove current user from friend's friends list
      await User.updateOne(
        { _id: friend._id },
        { $pullAll: { friends: [user._id] } }
      );

      return res.sendStatus(200);
    } else {
      // Unauthorized user
      return res.sendStatus(401);
    }
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
});

exports.friend_request_list = asyncHandler(async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization;
      const decoded = jwt.verify(token, process.env.SECRET);
      const user = await User.findById(decoded.user_id).exec();

      if (user === null) {
        return res.sendStatus(401);
      }

      const sent_requests = await User.find({
        _id: { $in: user.friends },
        friends: { $nin: user._id },
      });

      const recieved_requests = await User.find(
        {
          _id: { $nin: user.friends },
          friends: user._id,
        },
        "username photo_url"
      ).exec();
      return res.status(200).send({
        sent: sent_requests,
        recieved: recieved_requests,
      });
    } else {
      // Unauthorized user
      return res.sendStatus(401);
    }
  } catch (err) {
    return res.sendStatus(500);
  }
});

exports.user_search = asyncHandler(async (req, res, next) => {
  // TODO: sanitize query?
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization;
      const decoded = jwt.verify(token, process.env.SECRET);
      const user = await User.findById(decoded.user_id).exec();

      if (user === null) {
        return res.sendStatus(401);
      }

      const users = await User.find(
        {
          $text: {
            $search: req.query.username,
          },
        },
        "friends photo_url username _id"
      ).exec();
      console.log(users);
      return res.status(200).send({ users: users });
    } else {
      // Unauthorized user
      return res.sendStatus(401);
    }
  } catch (err) {
    return res.sendStatus(500);
  }
});

exports.user_profile_put = asyncHandler(async (req, res, next) => {
  // TODO: add sanitizers for body
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization;
      const decoded = jwt.verify(token, process.env.SECRET);
      const user = await User.findById(decoded.user_id).exec();

      if (user === null) {
        return res.sendStatus(401);
      }

      if (req.body.photo_url) {
        user.photo_url = req.body.photo_url;
      }

      if (req.body.status) {
        user.status = req.body.status;
      }

      const result = await user.save();
      console.log(result);
      return res.sendStatus(200);
    } else {
      // Unauthorized user
      return res.sendStatus(401);
    }
  } catch (err) {
    return res.sendStatus(err);
  }
});
